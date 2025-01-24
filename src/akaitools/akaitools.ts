import fs from "fs/promises";
import {spawn} from 'child_process'
import path from "path";
import {Result} from "@/lib/lib-core.js";

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

export async function akaiList(c: AkaiToolsConfig, akaiPath: string = '/', partition = 1) {
    await validateConfig(c)
    const bin = path.join(c.akaiToolsPath, 'akailist')
    const args = ['-f', `${c.diskFile}`, '-l', '-p', String(partition), '-u', `"${akaiPath}"`]
    process.env['PERL5LIB'] = c.akaiToolsPath

    return new Promise<AkaiRecordResult>(async (resolve, reject) => {
        const rv: AkaiRecordResult = {data: [], errors: []}
        const child = spawn(bin, args, {shell: true})

        let record: AkaiRecord = {block: 0, name: "", size: 0, type: AkaiRecordType.NULL}
        let parsing = false
        child.stdout.setEncoding('utf8')
        child.stdout.on('data', (data) => {
            for (const line of String(data).split('\n')) {
                if (data.startsWith('/') && data.endsWith(':')) {
                    if (parsing) {
                        rv.data.push(record)
                        record = {block: 0, name: "", size: 0, type: AkaiRecordType.NULL}
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
        })

        child.on('error', (e) => {
            rv.errors.push(e);
            resolve(rv)
        })
        child.on('close', (code, signal) => {
            if (code !== null) {
                resolve(rv)
            } else {
                reject(new Error('Process terminated without an exit code.'))
            }
        })
        child.stderr.on('data', data => {
            rv.errors.push(new Error(data))
        })

        setTimeout(() => reject(new Error(`Timout executing ${bin}.`)), 5 * 1000)
    })
}

export async function validateConfig(c: AkaiToolsConfig) {

    let s = await fs.stat(c.diskFile)
    if (!s.isFile()) {
        throw new Error(`Akai disk file path not a regular file: ${c.diskFile}`)
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
