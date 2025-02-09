import fs from "fs/promises"
import path from "path"
import {parseFile} from "music-metadata"

export function description() {
    return "lib-translate is a collection of functions to translate between sampler formats."
}

export interface Program {
    keygroups: Keygroup[]
}

export interface Keygroup {
    zones: Zone[]
}

export interface AudioMetadata {
    sampleRate?: number
    bitDepth?: number
    channelCount?: number
    sampleCount?: number
    container?: string
    codec?: string
}

export interface AudioSource {
    meta: AudioMetadata
    url: string
}

export interface Zone {
    audioSource: AudioSource
    lowNote: number
    highNote: number
}

export type MapFunction = (s: AudioSource[]) => Keygroup[]

export const mapLogicAutoSampler: MapFunction = (sources: AudioSource[]) => {
    const rv: Keygroup[] = []
    for (const s of sources) {
        rv.push({
            zones: [{audioSource: s, lowNote: 0, highNote: 127}]
        })
    }
    return rv
}

export async function mapProgram(mapFunction: MapFunction, opts: { source: string, target: string }) {
    if (!mapFunction) {
        throw new Error(`Map function undefined.`)
    }
    if (!opts) {
        throw new Error(`Options undefined.`)
    }
    const sources: AudioSource[] = []
    for (const item of await fs.readdir(opts.source)) {

        const filepath = path.join(opts.source, item);
        try {
            const meta = await parseFile(filepath, {duration: false, skipCovers: true});
            if (meta && meta.format) {
                const format = meta.format
                const m: AudioMetadata = {
                    bitDepth: format.bitsPerSample,
                    channelCount: format.numberOfChannels,
                    sampleCount: format.numberOfSamples,
                    sampleRate: format.sampleRate
                }

                sources.push({meta: m, url: `file://${filepath}`})
            }

        } catch (e) {
            // probably check to see what's wrong
        }
    }

    return {keygroups: mapFunction(sources)}
}