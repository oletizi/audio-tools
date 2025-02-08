export function description() {
    return "lib-translate is a collection of functions to translate between sampler formats."
}

export interface Program {
    keygroups: Keygroup[]
}

export interface Keygroup {
    zones: Zone[]
}

export interface AudioSource {}

export interface Zone {
    audioSource: AudioSource
    lowNote: number
    highNote: number
}

export type MapFunction = (s: AudioSource) => Keygroup

export async function mapProgram(mapFunction: MapFunction, opts: { source: string, target: string }) {
    if (!mapFunction) {
        throw new Error(`Map function undefined.`)
    }
    if (!opts) {
        throw new Error(`Options undefined.`)
    }
    const rv: Program = {keygroups: []}

    return rv
}