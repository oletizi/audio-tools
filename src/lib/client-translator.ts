import {FileSetResult} from "@/lib/lib-fs-api";
import {newServerConfig} from "@/lib/config-server";
import {list} from "@/lib/lib-fs-server";

export async function listSource(path: string, filter: (f:File) => boolean = () => true): Promise<FileSetResult> {
    const cfg = await newServerConfig()
    return list(cfg.sourceRoot + path, filter)
}

export async function listTarget(path: string, filter: (f: File) => boolean = () => true){
    const cfg = await newServerConfig()
    return list(cfg.targetRoot + path, filter)
}