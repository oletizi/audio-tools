import fs from "fs/promises";
import {spawn} from 'child_process'
import path from "path";
import {byte2nibblesLE, nibbles2byte, Result} from "@/lib/lib-core";
import {
    KeygroupHeader,
    parseKeygroupHeader,
    parseProgramHeader,
    ProgramHeader,
    ProgramHeader_writeGROUPS
} from "@/midi/devices/s3000xl";
import {newServerConfig} from "@/lib/config-server";


export const CHUNK_LENGTH = 384
// export const KEYGROUP1_START_OFFSET = 384
// export const KEYGROUP2_START_OFFSET = 768
// export const KEYGROUP_LENGTH = KEYGROUP2_START_OFFSET - KEYGROUP1_START_OFFSET

// number of bytes before header start in the raw data backing each header.
// This is an artifact of the auto-generated code assuming a sysex environment which has 7 bytes of midi and housekeeping
// data in the raw midi data. This should probably sorted out in the auto-generated code.
export const RAW_LEADER = 7

export interface AkaiToolsConfig {
    diskFile: string
    akaiToolsPath: string
    piscsiHost?: string
    scsiId?: number
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

export interface AkaiProgramFile {
    program: ProgramHeader
    keygroups: KeygroupHeader[]
}

export interface AkaiRecordResult extends Result {
    data: AkaiRecord[]
}

export interface ExecutionResult {
    errors: Error[];
    code: number;
}

export async function newAkaiToolsConfig() {
    const cfg = await newServerConfig()
    const rv: AkaiToolsConfig = {
        piscsiHost: cfg.piscsiHost, scsiId: cfg.s3kScsiId,
        akaiToolsPath: cfg.akaiTools,
        diskFile: cfg.akaiDisk
    }
    return rv
}


export interface RemoteVolume {
    scsiId: number
    image: string
}

export interface RemoteVolumeResult {
    errors: Error[]
    data: RemoteVolume[]
}

export async function remoteSync(c: AkaiToolsConfig) {
    throw new Error("Implement Me!")
}

export async function remoteUnmount(c: AkaiToolsConfig, v: RemoteVolume) {
    const rv: ExecutionResult = {code: -1, errors: []}
    if (!c.piscsiHost) {
        rv.errors.push(new Error('Piscsi host is not defined.'))
    } else {
        const result = await doSpawn('ssh', [c.piscsiHost, `"scsictl -c d -i ${v.scsiId}"`])
        rv.code = result.code
        rv.errors = rv.errors.concat(result.errors)
    }
    return rv
}

export async function remoteMount(c: AkaiToolsConfig, v: RemoteVolume) {
    const rv: ExecutionResult = {code: -1, errors: []}
    if (!c.piscsiHost) {
        rv.errors.push(new Error('Piscsi host is not defined'))
    } else {
        const result = await doSpawn('ssh', [c.piscsiHost, `"scsictl -c a -i ${v.scsiId} -f ${v.image}"`])
        rv.code = result.code
        rv.errors = rv.errors.concat(result.errors)
    }
    return rv
}

export async function remoteVolumes(c: AkaiToolsConfig) {
    const rv: RemoteVolumeResult = {data: [], errors: []}
    if (!c.piscsiHost) {
        rv.errors.push(new Error('Piscsi host is not defined.'))
    } else {
        const result = await doSpawn('ssh', [c.piscsiHost, '"scsictl -l"'], {
            onData: data => {
                console.log(data)
            },
            onStart: child => {
            }
        })

    }
    return rv
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

export async function readAkaiProgram(file: string): Promise<AkaiProgramFile> {
    const data = await readAkaiData(file)
    const rv: AkaiProgramFile = {keygroups: [], program: {} as ProgramHeader}
    parseProgramHeader(data, 1, rv.program)
    rv.program.raw = new Array(RAW_LEADER).fill(0).concat(data)
    for (let i = 0; i < rv.program.GROUPS; i++) {
        const kg = {} as KeygroupHeader
        // const kgData = data.slice(KEYGROUP1_START_OFFSET + KEYGROUP_LENGTH * i);
        const kgData = data.slice(CHUNK_LENGTH + CHUNK_LENGTH * i)
        parseKeygroupHeader(kgData, 0, kg)
        kg.raw = new Array(RAW_LEADER).fill(0).concat(kgData)
        rv.keygroups.push(kg)
    }
    return rv
}

export function addKeygroup(p: AkaiProgramFile) {
    const proto = p.keygroups[p.keygroups.length - 1]
    const kg = {} as KeygroupHeader
    // const kgData = proto.raw.slice(KEYGROUP1_START_OFFSET + KEYGROUP_LENGTH * p.keygroups.length)
    const kgData = proto.raw.slice(CHUNK_LENGTH + CHUNK_LENGTH * p.keygroups.length)
    parseKeygroupHeader(kgData, 0, kg)
    kg.raw = new Array(RAW_LEADER).fill(0).concat(kgData)
    p.keygroups.push(kg)
    ProgramHeader_writeGROUPS(p.program, p.keygroups.length)
}

export async function writeAkaiProgram(file: string, p: AkaiProgramFile) {
    const nibbles = p.program.raw.slice(RAW_LEADER)
    for (let i = 0; i < p.keygroups.length; i++) {
        const kgData = p.keygroups[i].raw.slice(RAW_LEADER)
        for (let j = 0; j < kgData.length; j++) {
            // nibbles[KEYGROUP1_START_OFFSET + KEYGROUP_LENGTH * i  + j] = kgData[j]
            nibbles[CHUNK_LENGTH + CHUNK_LENGTH * i + j] = kgData[j]
        }
    }
    const outdata = []
    for (let i = 0; i < nibbles.length; i += 2) {
        outdata.push(nibbles2byte(nibbles[i], nibbles[i + 1]))
    }
    await fs.writeFile(file, Buffer.from(outdata))
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
    console.log(`akaiwrite: sourcePath: ${sourcePath}`)
    console.log(`akaiwrite: targetPath: ${targetPath}`)
    return doSpawn(
        path.join(c.akaiToolsPath, 'akaiwrite'),
        ['-f', c.diskFile, '-p', String(partition), '-d', `"${targetPath}"`, `"${sourcePath}"`])
}

export async function akaiRead(c: AkaiToolsConfig, sourcePath: string, targetPath: string, partition: number = 1, recursive: boolean = true) {
    process.env['PERL5LIB'] = c.akaiToolsPath
    console.log(`akairead: sourcePath: ${sourcePath}`)
    console.log(`akairead: targetPath: ${targetPath}`)
    return doSpawn(
        path.join(c.akaiToolsPath, 'akairead'),
        ['-f', c.diskFile, '-p', String(partition), '-d', `"${targetPath}"`, recursive ? '-R' : '', `"${sourcePath}"`])

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
    rv.errors = rv.errors.concat(result.errors)
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
        console.log(`akaitools: ${bin} ${args.join(' ')}`)
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
