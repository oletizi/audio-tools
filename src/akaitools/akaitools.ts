import fs from "fs/promises";
import {spawn} from 'child_process'
import path from "path";
import {byte2nibblesLE, Result} from "@/lib/lib-core.js";

export const KEYGROUP_START_OFFSET = 384

export interface AkaiToolsConfig {
    diskFile: string
    akaiToolsPath: string
}

export enum AkaiRecordType {
    NULL = 'NULL',
    VOLUME = 'S3000 VOLUME',
    PROGRAM = 'S3000 PROGRAM',
    SAMPLE = 'S3000 SAMPLE'
}

export interface AkaiRecord {
    type: AkaiRecordType
    name: string
    block: number
    size: number
}

export interface AkaiRecordResult extends Result {
    data: AkaiRecord[]
}

export interface ExecutionResult {
    errors: number[];
    code: number;
}

export async function readAkaiData(file: string) {
    const buffer = await fs.readFile(file)
    const data = []
    for (let i = 0; i < buffer.length; i++) {
        const nibbles = byte2nibblesLE(buffer[i])
        data.push(nibbles[0])
        data.push(nibbles[1])
    }
    return data;
}


export async function akaiFormat(c: AkaiToolsConfig, partitionSize: number = 1, partitionCount = 1) {
    process.env['PERL5LIB'] = c.akaiToolsPath
    return doSpawn(
        path.join(c.akaiToolsPath, 'akaiformat'),
        ['-f', String(c.diskFile)].concat(new Array(partitionCount).fill(partitionSize)),
        {
            onData: voidFunction,
            onStart: (child) => {
                child.stdin.write('y\n')
            }
        }
    )
}

export async function akaiWrite(c: AkaiToolsConfig, sourcePath: string, targetPath: string, partition: number = 1) {
    process.env['PERL5LIB'] = c.akaiToolsPath
    console.log(`write: sourcePath: ${sourcePath}`)
    console.log(`WRite: targetPath: ${targetPath}`)
    return doSpawn(
        path.join(c.akaiToolsPath, 'akaiwrite'),
        ['-f', c.diskFile, '-p', String(partition), '-d', `"${targetPath}"`, `"${sourcePath}"`])

}

/**
 *
 * @param c configuration
 * @param sourcePath path to wav file to convert
 * @param targetPath path to output directory on local filesystem (**not** in an Akai disk) to write converted sample files to
 * @param targetName name of the converted sample. Should obey Akai name requirements (<= 12 characters, alpha+a few extra characters)
 */
export async function wav2Akai(c: AkaiToolsConfig, sourcePath: string, targetPath: string, targetName: string) {
    process.env['PERL5LIB'] = c.akaiToolsPath
    return doSpawn(
        path.join(c.akaiToolsPath, 'wav2akai'),
        ['-n', targetName, '-d', `"${targetPath}"`, `"${sourcePath}"`]
    )
}

export async function akaiList(c: AkaiToolsConfig, akaiPath: string = '/', partition = 1) {
    await validateConfig(c)
    const rv: AkaiRecordResult = {data: [], errors: []}
    const bin = path.join(c.akaiToolsPath, 'akailist')
    const args = ['-f', `${c.diskFile}`, '-l', '-p', String(partition), '-u', `"${akaiPath}"`]
    process.env['PERL5LIB'] = c.akaiToolsPath
    let parsing = false

    function newRecord(): AkaiRecord {
        return {block: 0, name: "", size: 0, type: AkaiRecordType.NULL}
    }

    let record = newRecord()
    const result = await doSpawn(bin, args, {
        onStart: () => {
        },
        onData: (data) => {
            for (const line of String(data).split('\n')) {
                if (data.startsWith('/') && data.endsWith(':')) {
                    if (parsing) {
                        rv.data.push(record)
                        record = newRecord()
                    }
                    parsing = true
                } else {
                    if (line === '') {
                        continue
                    }
                    record.type = line.slice(0, 23).trim() as AkaiRecordType
                    record.block = Number.parseInt(line.slice(23, 25).trim())
                    record.size = Number.parseInt(line.slice(25, 34).trim())
                    record.name = line.slice(35).trim()
                    rv.data.push(record)
                }
            }
        }
    })
    return rv
}



function voidFunction() {
}

async function doSpawn(bin: string, args: readonly string[],
                       opts: {
                           onData: (Buffer, ChildProcess) => void,
                           onStart: (ChildProcess) => void
                       } = {onData: voidFunction, onStart: voidFunction}) {
    return new Promise<ExecutionResult>((resolve, reject) => {
        const rv = {errors: [], code: -1}
        const child = spawn(bin, args, {shell: true})
        child.stdout.setEncoding('utf8')
        opts.onStart(child)
        child.stdout.on('data', data => {
            opts.onData(data, child)
        })

        child.on('error', (e) => {
            rv.errors.push(e);
            resolve(rv)
        })
        child.on('close', (code, signal) => {
            if (code !== null) {
                rv.code = code
                resolve(rv)
            } else {
                reject(new Error('Process terminated without an exit code.'))
            }
        })
        child.stderr.on('data', data => {
            process.stderr.write(data)
            rv.errors.push(new Error(data))
        })

        setTimeout(() => reject(new Error(`Timout executing ${bin}.`)), 5 * 1000)
    })
}

export async function validateConfig(c: AkaiToolsConfig) {
    let s
    try {
        s = await fs.stat(c.diskFile)
    } catch (e) {
    }

    if (s?.isDirectory()) {
        throw new Error(`Akai disk file is a directory: ${c.diskFile}`)
    }

    s = await fs.stat(c.akaiToolsPath)
    if (!s.isDirectory()) {
        throw new Error(`Akai tools path is not a directory: ${c.akaiToolsPath}`)
    }

    if (!new Set([
        'akai2wav',
        'akailist',
        'akaiconv',
        'akaiformat',
        'akailist',
        'akaimkdir',
        'akairead',
        'akaiwrite',
        'any2akai',
        'akai2wav'
    ]).isSubsetOf(new Set(await fs.readdir(c.akaiToolsPath)))) {
        throw new Error(`Akai tools path does not contain expected executables.`)
    }
}
