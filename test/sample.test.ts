import {getSamples} from "../src/ts/decent"
import fs from "fs/promises";
import * as path from "path";
import wavefile from "wavefile"
describe('Sample', async () => {
    it('Trims a sample', async () => {
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


        // wav.fromBuffer(await fs.readFile(path.join(dir, sample.path)))
        // console.log(`container: ${wav.container}`)
        // console.log(`format: ${wav.format}`)
        // console.log(`channels: ${wav.fmt.numChannels}`)
        // console.log(`sample rate: ${wav.fmt.sampleRate}`)
        // console.log(`bits per sample: ${wav.fmt.bitsPerSample}`)
        // console.log(`data chunk size: ${wav.data.chunkSize}`)
        // console.log(`data length    : ${wav.data.samples.length}`)
        //
        // console.log(`sample start: ${sample.start}`)
        // console.log(`sample end  : ${sample.end}`)

        // wav.data.samples = wav.data.samples.slice(sample.start * wav.fmt.numChannels, sample.end * wav.fmt.numChannels)
        // wav.data.chunkSize = wav.data.samples.length

        // await fs.writeFile('build/trim.wav', wav.toBuffer())

        // wav.fromBuffer(await fs.readFile('build/trim.wav'))
        // console.log(`trimmed: ${JSON.stringify(wav, null, 2)}`)
    })
})