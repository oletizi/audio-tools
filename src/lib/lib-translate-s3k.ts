import {
    addKeygroup,
    AkaiToolsConfig,
    akaiWrite,
    ExecutionResult, RAW_LEADER, readAkaiData,
    readAkaiProgram,
    wav2Akai, writeAkaiProgram
} from "@/akaitools/akaitools";
import fs from "fs/promises"
import {createWriteStream} from 'fs'
import {newSampleFromBuffer} from "@/model/sample";
import path from "path";
import {pad} from "@/lib/lib-core";
import {newServerConfig} from "@/lib/config-server";
import {
    KeygroupHeader_writeSNAME1,
    parseSampleHeader,
    ProgramHeader_writePRNAME,
    SampleHeader
} from "@/midi/devices/s3000xl";

export async function chop(c: AkaiToolsConfig, source: string, target: string, prefix: string, samplesPerBeat: number, beatsPerChop: number) {
    const cfg = await newServerConfig()
    const rv: ExecutionResult = {code: -1, errors: []}
    if (samplesPerBeat <= 0 || beatsPerChop <= 0) {
        throw new Error(`Bad params: samplesPerBeat: ${samplesPerBeat}, beatsPerChop: ${beatsPerChop}`)
    }
    if (!(await fs.stat(source)).isFile()) {
        throw new Error(`Source is not a regular file: ${source}`)
    }
    try {
        const stats = await fs.stat(target)
        if (!stats.isDirectory()) {
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
    const p = await readAkaiProgram(cfg.s3kDefaultProgram)
    ProgramHeader_writePRNAME(p.program, prefix)
    for (let i = 0; i < sampleCount; i += chopLength) {
        const chop = sample.trim(i, i + chopLength)
        let targetName = prefix + '.' + pad(count, 2)
        const outfile = path.join(target, targetName) + '.wav'
        await chop.writeToStream(createWriteStream(outfile))
        const result = await wav2Akai(c, outfile, target, targetName)
        if (count > 0) {
            // addKeygroup(p)
            for (let j=0; j<chop.getChannelCount(); j++) {
                addKeygroup(p)
            }
        }
        count++
    }
    if (rv.errors.length === 0) {
        for (const f of await fs.readdir(target)) {
            if (f.endsWith('a3s')) {
                const result = await akaiWrite(c, path.join(target, f), `/${prefix}`)
                if (result.errors.length !== 0) {
                    rv.errors = rv.errors.concat(rv.errors, result.errors)
                    break
                }
                // const buf = await fs.readFile(path.join(target, f))
                const data = await readAkaiData(path.join(target, f))
                const sampleHeader = {} as SampleHeader
                parseSampleHeader(data, 1, sampleHeader)
                sampleHeader.raw = new Array(RAW_LEADER).fill(0).concat(data)

                KeygroupHeader_writeSNAME1(p.keygroups[count], sampleHeader.SHNAME)
                if (result.errors.length > 0) {
                    rv.errors = rv.errors.concat(result.errors)
                    break
                }

            }
        }
        const programPath = path.join(target, prefix + '.a3p');
        await writeAkaiProgram(programPath, p)
        await akaiWrite(c, programPath, `/${prefix}`)

    }
    if (rv.errors.length === 0) {
        rv.code = 0
    }
    return rv
}