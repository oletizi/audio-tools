import {FileSetResult} from "@/lib/lib-fs-api";
import {newClientCommon} from "@/lib/client-common";
const root = '/api/t'
const client = newClientCommon((msg)=>console.log(msg), (msg) => console.error(msg))
export async function listSource(path: string, filter: (f:File) => boolean = () => true): Promise<FileSetResult> {

    if (path === '/') {
        path = ''
    }
    if (path.endsWith('/')) {
        path = path.substring(0, path.length - 1)
    }
    return await client.get(root + '/source/root' + path) as FileSetResult
}

export async function listTarget(path: string, filter: (f: File) => boolean = () => true){
    return await client.get(root + '/target/root' + path) as FileSetResult
}