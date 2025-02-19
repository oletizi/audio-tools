import fs from "fs/promises"
import path from "pathe"
import _ from "lodash"
import {parseFile} from "music-metadata"
import {midiNoteToNumber} from "@/lib-midi.js";
import {newDefaultSampleFactory} from "@/sample.js";

export function description() {
    return "lib-translate is a collection of functions to translate between sampler formats."
}

export interface fileio {

}

export interface AbstractProgram {
    keygroups: AbstractKeygroup[]
}

export interface AbstractKeygroup {
    zones: AbstractZone[]
}

export interface AbstractZone {
    audioSource: AudioSource
    lowNote: number
    highNote: number
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

    getSample(): Promise<Sample>
}

export interface AudioFactory {
    loadFromFile(filename: string): Promise<AudioSource>
}


export type MapFunction = (s: AudioSource[]) => AbstractKeygroup[]

export interface TranslateContext {
    fs: fileio
    audioFactory: AudioFactory
}

export function newDefaultAudioFactory(): AudioFactory {
    return {
        loadFromFile: async (filename: string) => {
            const m = await parseFile(filename)
            return {
                meta: {
                    sampleRate: m.format.sampleRate,
                    bitDepth: m.format.bitsPerSample,
                    channelCount: m.format.numberOfChannels,
                    sampleCount: m.format.numberOfSamples,
                    container: m.format.container,
                    codec: m.format.codec,
                },
                url: `file://${filename}`,
                getSample(): Promise<Sample> {
                    return newDefaultSampleFactory().newSampleFromFile(filename)
                }
            }
        }
    }
}

export function newDefaultTranslateContext(): TranslateContext {
    return {audioFactory: newDefaultAudioFactory(), fs: fs}
}

export const mapLogicAutoSampler: MapFunction = (sources: AudioSource[]) => {
    const rv: AbstractKeygroup[] = []

    const note2Samples = new Map<number, AudioSource[]>()
    for (const s of sources) {
        const match = s.url.match(/-([A-G][#b]*[0-9])-/)
        if (match && match[1]) {
            const noteName = match[1]
            const noteNumber = midiNoteToNumber(noteName)
            if (noteNumber != null) {
                if (note2Samples.get(noteNumber)) {
                    note2Samples.get(noteNumber)?.push(s)
                } else {
                    note2Samples.set(noteNumber, [s])
                }
            }
        }
    }
    let start = 0
    Array.from(note2Samples.keys()).sort((a, b) => {
        return a - b
    }).forEach(i => {
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

export async function mapProgram(ctx: TranslateContext, mapFunction: MapFunction, opts: {
    source: string,
    target: string
}) {
    if (!ctx) {
        throw new Error(`Translate context undefined.`)
    }
    if (!ctx.audioFactory) {
        throw new Error(`Translate context audio factory undefined.`)
    }
    if (!ctx.fs) {
        throw new Error(`Translate context fs undefined.`)
    }
    if (!mapFunction) {
        throw new Error(`Map function undefined.`)
    }
    if (!opts) {
        throw new Error(`Options undefined.`)
    }
    const sources: AudioSource[] = []
    const audioFactory = ctx.audioFactory
    for (const item of await ctx.fs.readdir(opts.source)) {
        const filepath = path.join(opts.source, item);
        try {
            const audio = await audioFactory.loadFromFile(filepath)
            const m = audio.meta
            sources.push({meta: m, url: `file://${filepath}`})
        } catch (e) {
            // probably check to see what's wrong
        }
    }

    return {keygroups: mapFunction(sources)}
}