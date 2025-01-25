import {AkaiToolsConfig, ExecutionResult} from "@/akaitools/akaitools";
import fs from "fs/promises"
import {createWriteStream} from 'fs'
import {newSampleFromBuffer} from "@/model/sample";
import path from "path";
import {pad} from "@/lib/lib-core";

export async function chop(c: AkaiToolsConfig, source: string, target: string, prefix: string, samplesPerBeat: number, beatsPerChop: number) {
    const rv: ExecutionResult = {code: -1, errors: []}
    if (samplesPerBeat <= 0 || beatsPerChop <= 0) {
        throw new Error(`Bad params: samplesPerBeat: ${samplesPerBeat}, beatsPerChop: ${beatsPerChop}`)
    }
    if (!(await fs.stat(source)).isFile()) {
        throw new Error(`Source is not a regular file: ${source}`)
    }
    try {
        const stats = await fs.stat(target)
        if (! stats.isDirectory()) {
            throw new Error(`Target is not a directory: ${target}`)
        }
    } catch (e) {
        await fs.mkdir(target)
    }

    const sample = newSampleFromBuffer(await fs.readFile(source))
    if (sample.getMetadata().sampleRate > 44100) {
        sample.to441()
    }
    if (sample.getMetadata().bitDepth > 16) {
        sample.to16Bit()
    }
    const sampleCount = sample.getSampleCount()
    const chopLength = samplesPerBeat * beatsPerChop
    let count = 0
    for (let i = 0; i < sampleCount; i += chopLength) {
        const chop = sample.trim(i, i + chopLength)
        const outfile = path.join(target, prefix + '.' + pad(count, 2)) + '.wav'
        await chop.writeToStream(createWriteStream(outfile))
        count++
    }
    return rv
}