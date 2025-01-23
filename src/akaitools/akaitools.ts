import fs from "fs/promises";

export interface AkaiToolsConfig {
    diskFile: string
    akaiToolsPath: string
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

    return new Set([
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
    ]).isSubsetOf(new Set(await fs.readdir(c.akaiToolsPath)))
}


