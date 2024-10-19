import {getSamples} from "../src/ts/decent"
import fs from "fs/promises";
import * as path from "path";
import wavefile from "wavefile"
import {newSampleFromBuffer} from "../src/ts/sample";

describe('Sample', async () => {
    it('Trims a sample via wavfile interface', async () => {
        let presetPath = "test/data/decent/Oscar.dspreset";
        const dir = path.dirname(presetPath)
        const samples = await getSamples(presetPath)
        const sample = samples[1]
        // const wav = new wavefileParser.WaveFileParser()
        const buf = await fs.readFile(path.join(dir, sample.path))
        const wav = new wavefile.WaveFile()
        wav.fromBuffer(buf)
        const trimmedSamples = wav.getSamples(true).slice(sample.start * wav.fmt.numChannels, sample.end * wav.fmt.numChannels)
        const trimmed = new wavefile.WaveFile()
        trimmed.fromScratch(wav.fmt.numChannels, wav.fmt.sampleRate, wav.bitDepth, trimmedSamples)
        console.log(`channels : ${wav.fmt.numChannels}`)
        console.log(`bit depth: ${wav.bitDepth}`)
        console.log(`rate     : ${wav.fmt.sampleRate}`)
        console.log(`samples  : ${wav.getSamples(true).length}`)
        console.log(`trimmed  : ${trimmedSamples.length}`)

        await fs.writeFile('build/trim.wav', trimmed.toBuffer())

    })
    it('Trims a sample via sample interface', async () => {
        let bytesWritten = 0
        const out = Buffer.alloc(1024 * 1000)
        const samplePath = 'test/data/mpc/Oscar/Oscar.WAV'
        const sample = newSampleFromBuffer(await fs.readFile(samplePath))
        bytesWritten = sample.write(out, 0)
        await fs.writeFile('build/untrimmed-sample.WAV', out.subarray(0, bytesWritten))

        const trimmed = sample.trim(0, 44100)
        bytesWritten = trimmed.write(out, 0)
        await fs.writeFile('build/trimmed-sample.WAV', out.subarray(0, bytesWritten))
    })
})