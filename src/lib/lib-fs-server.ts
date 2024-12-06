import fs from "fs/promises";
import {DirectorySpec, FileSpec, FileSet, FileSetResult} from "@/lib/lib-fs-api";
import path from "path";
import {newServerOutput} from "@/lib/process-output";

const out = newServerOutput(true, ': lib-fs-server')

export async function list(dir: string): Promise<FileSetResult> {
    const errors: Error[] = []
    const dirs: DirectorySpec[] = []
    const files: FileSpec[] = []
    try {
        for (const item of await fs.readdir(dir)) {
            let itemPath = path.join(dir, item);
            const stats = await fs.stat(itemPath)
            if (stats.isDirectory()) {
                dirs.push({
                    name: item,
                    isDirectory: true
                })
            } else if (stats.isFile()) {
                files.push({
                    name: item,
                    isDirectory: false
                })
            }
        }
    } catch (e) {
        out.error(e)
        errors.push(e)
    }
    const set: FileSet = {
        directories: dirs, files: files
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
