import {PathLike} from "fs";

export interface Sample {
    attack: number
    attackcurve: number
    decay: number
    decaycurve: number
    end: number
    hinote: number
    hivel: number
    lonote: number
    lovel: number
    pan: number
    path: string
    pitchkeytrack: number
    release: number
    releasecurve: number
    rootnote: number
    start: number
    sustain: number
    volume: number
}


/**
 * Trims sample to start and end length. Writes a new sample to the output path.
 * @param outputPath
 * @param sample
 */
export function trimSample(outputPath: PathLike, sample: Sample): Sample {
    return {
        attack: 0,
        attackcurve: 0,
        decay: 0,
        decaycurve: 0,
        end: 0,
        hinote: 0,
        hivel: 0,
        lonote: 0,
        lovel: 0,
        pan: 0,
        path: "",
        pitchkeytrack: 0,
        release: 0,
        releasecurve: 0,
        rootnote: 0,
        start: 0,
        sustain: 0,
        volume: 0
    }
}