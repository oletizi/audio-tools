import fs from "fs/promises";
import {Result} from "@/lib/lib-core";

export async function objectFromFile(filename: string) {
    const rv = {
        errors: [],
        data: null
    } as Result
    try {
        rv.data = JSON.parse((await fs.readFile(filename)).toString())
    } catch (e) {
        rv.errors.push(e)
    }
    return rv
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
