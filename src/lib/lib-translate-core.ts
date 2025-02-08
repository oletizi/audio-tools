import {Sample} from "@/model/sample";
import fs from "fs/promises";
import {parseFile} from "music-metadata";
import path from "path";
import _ from "lodash"

export interface Program {
    keygroups: Keygroup[]
}

export interface Keygroup {
    zones: Zone[]
}

export interface Zone {
    sample: Sample
    lowNote: number
    highNote: number
}

export type MapFunction = (s: Sample) => Keygroup

export async function mapProgram(mapFunction: MapFunction, opts: { source: string, target: string }) {
    if (!mapFunction) {
        throw new Error(`Map function undefined.`)
    }
    if (!opts) {
        throw new Error(`Options undefined.`)
    }

    const stats = await fs.stat(opts.source)
    if (!stats.isDirectory()) {
        throw new Error(`Source is not a directory: ${opts.source}`)
    }
    const rv: Program = {keygroups: []}
    const items = await fs.readdir(opts.source)
    for (const item of items) {
        const filepath = path.join(opts.source, item)
        console.log(`filepath: ${filepath}`)
        await parseFile(filepath)
    }

    return rv
}