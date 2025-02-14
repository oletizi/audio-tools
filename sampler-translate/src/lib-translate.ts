import fs from "fs/promises"
import path from "path"
import _ from "lodash"
import {parseFile} from "music-metadata"
import {midiNoteToNumber} from "@/lib-midi.js";

export function description() {
    return "lib-translate is a collection of functions to translate between sampler formats."
}

export interface AbstractProgram {
    keygroups: AbstractKeygroup[]
}

export interface AbstractKeygroup {
    zones: AbstractZone[]
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

export interface AbstractZone {
    audioSource: AudioSource
    lowNote: number
    highNote: number
}

export type MapFunction = (s: AudioSource[]) => AbstractKeygroup[]

export const mapLogicAutoSampler: MapFunction = (sources: AudioSource[]) => {
    const rv: AbstractKeygroup[] = []

    // const note2Samples = new Map<number, AudioSource[]>()
    const note2Samples = new Map<number, AudioSource[]>()
    for (const s of sources) {
        const match = s.url.match(/-([A-G][#b]*[0-9])-/)
        if (match && match[1]) {
            const noteName = match[1]
            const noteNumber = midiNoteToNumber(noteName)
            if (noteNumber != null) {
                console.log(`Note number: ${noteNumber}`)
                if (note2Samples.get(noteNumber)) {
                    note2Samples.get(noteNumber)?.push(s)
                } else {
                    note2Samples.set(noteNumber, [s])
                }
            }
        }
    }
    let start = 0
    Array.from(note2Samples.keys()).sort((a, b) => {return a - b}).forEach(i => {
        const zones: AbstractZone[] = []
        _(note2Samples.get(i)).each(s => {
            zones.push({audioSource: s, highNote: i, lowNote: start})
        })
        rv.push({
            zones: zones
        })
        start = i + 1
    })

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