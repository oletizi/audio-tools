import {DirectorySpec, FileSet, FileSetResult} from "@/lib/lib-fs-api";
import {newClientCommon} from "@/lib/client-common";

const root = '/api/t'
const client = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))

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