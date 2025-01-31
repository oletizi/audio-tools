import {FileSetResult} from "@/lib/lib-fs-api";
import {newClientCommon} from "@/lib/client-common";
import {JobId} from "@/lib/lib-jobs";

const root = '/api/t'
const client = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))

export async function getProgress(jobId: JobId) {
    return await client.post(root + '/progress', {jobId: jobId})
}

export async function chopSample(path:string, partition: number,  prefix: string, samplesPerBeat: number, beatsPerChop: number){
    return await client.post(root + '/chop', {path: path, partition: partition, prefix:prefix, samplesPerBeat: samplesPerBeat, beatsPerChop: beatsPerChop
    })
}

export async function getAkaiDisk(){
    return await client.get(root + '/akaidisk')
}

export async function getMeta(path:string) {
    return await client.get(root + '/meta/' + path)
}

export async function translate(path: string) {
    return await client.post(root + '/translate', {path: path})
}

export async function cdSource(path: string) {
    await cd(root + '/cd/source', path)
}

export async function cdTarget(path: string) {
    await cd(root + '/cd/target', path)
}

async function cd(endpoint: string, path: string) {
    await client.post(endpoint, {path: path})
}

export async function listSource(filter: (f: File) => boolean = () => true): Promise<FileSetResult> {
    return list(root + '/list/source', filter)
}

export async function listTarget(filter: (f: File) => boolean = () => true) {
    return list(root + '/list/target', filter)
}

async function list(endpoint, filter: (f: File) => boolean) {

    const rv = await client.get(endpoint) as FileSetResult

    if (rv.data.directories) {
        rv.data.directories = rv.data.directories.filter((f) => filter(f as File))
    }
    if (rv.data.files) {
        rv.data.files = rv.data.files.filter(i => filter(i as File))
    }
    return rv
}
export async function mkdirSource(path) {
    await mkdir( root + '/mkdir/source', path)
}

export async function mkdirTarget(path) {
    await mkdir(root + '/mkdir/target', path)
}

async function mkdir(endpoint, path) {
    await client.post(endpoint, {path: path})
}

export async function rmTarget(path:string) {
    await rm(root + '/rm/target', path)
}

async function rm(endpoint, path) {
    await client.post(endpoint, {path: path})
}