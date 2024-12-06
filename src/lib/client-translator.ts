import {Directory, FileSet, FileSetResult} from "@/lib/lib-fs-api";
import {newClientCommon} from "@/lib/client-common";

const root = '/api/t'
const client = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))

export async function listSource(path: string, filter: (f: Directory) => boolean = () => true): Promise<FileSetResult> {
    return list(root + '/list/source/root', path, filter)
}

export async function listTarget(path: string, filter: (f: File) => boolean = () => true) {
    return list(root + '/list/target/root', path, filter)
}

async function list(endpoint, path, filter: (f: File) => boolean){
    if (path === '/') {
        path = ''
    }
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1)
    }
    const rv = await client.get(endpoint + path) as FileSetResult
    rv.data.directories = rv.data.directories.filter((f) => filter(f as File))
    rv.data.files = rv.data.files.filter(i => filter(i as File))
    return rv
}