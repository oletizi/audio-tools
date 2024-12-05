import fs from "fs/promises";
import {Directory, File, FileSet, FileSetResult} from "@/lib/lib-fs-api";
import path from "path";

export async function list(dir: string, filter: (f: File) => boolean = () => true): Promise<FileSetResult> {
    const errors: Error[] = []
    const dirs: Directory[] = []
    const files: File[] = []
    try {
        for (const item of await fs.readdir(dir)) {
            const stats = await fs.stat(path.join(dir, item))
            if (stats.isDirectory()) {
                dirs.push({
                    name: item
                })
            } else if (stats.isFile()) {
                files.push({name: item})
            }
        }
    } catch (e) {
        errors.push(e)
    }
    const set: FileSet = {
        directories: dirs.filter(filter), files: files.filter(filter)
    }
    return {
        data: set,
        errors: errors
    }
}

export async function mkdir(dir: string) {
    if (!dir) return false
    try {
        return (await fs.stat(dir)).isDirectory()
    } catch (e) {
        try {
            await fs.mkdir(dir)
            return true
        } catch (e) {
            return false
        }
    }
}
