import {newSampleFromBuffer} from "@/sample.js";
import fs from "fs/promises";
import {expect} from "chai";
import * as wavefile from "wavefile"
import {tmpdir} from "node:os";
import path from "pathe";
import {createWriteStream} from "fs";

describe('wavefile', () => {
    it(`Can read a wavefile`, async () => {
        const w = new wavefile.default.WaveFile()
        expect(w).not.eq(null)
    })
})

describe('sample', () => {
    it('Parses a wave file', async () => {
        const s = newSampleFromBuffer(await fs.readFile('test/data/mpc/Dub Tao A Kit.WAV'))
        expect(s).not.eq(null)
        expect(s.getSampleRate()).eq(44100)
        expect(s.getBitDepth()).eq(16)
        expect(s.getChannelCount()).eq(2)
        expect(s.getSampleCount()).eq(655726)
        expect(s.getMetadata()).to.be.an('object')
        const meta = s.getMetadata()
        expect(meta.bitDepth).eq(16)
        expect(meta.sampleRate).eq(44100)
        expect(meta.channelCount).eq(2)
        expect(meta.loopCount).eq(1)
        expect(meta.manufacturerId).eq(16777287)
        expect(meta.pitchFraction).eq(0)
        expect(meta.productId).eq(94)
        expect(meta.rootNote).eq(60)
        expect(meta.sampleLength).eq(655726)
        expect(meta.samplePeriod).eq(22675)
        expect(meta.smpteFormat).eq(25)
        expect(meta.smpteOffset).eq(0)
    })
    it(`Manipulates wave file`, async function () {
        this.timeout(10000)
        const s = newSampleFromBuffer(await fs.readFile('test/data/mpc/Dub Tao A Kit.WAV'))
        const currentRootNote = s.getMetadata().rootNote
        expect(currentRootNote).eq(60)

        s.setRootNote(currentRootNote + 1)
        expect(s.getMetadata().rootNote).eq(currentRootNote + 1)

        const s2 = newSampleFromBuffer(await fs.readFile("test/data/decent/Samples/Oscar.wav"))
        expect(s2.getBitDepth()).eq(24)
        expect(s2.getSampleRate()).eq(44100)

        s2.to16Bit()
        expect(s2.getBitDepth()).eq(16)

        s2.to24Bit()
        expect(s2.getBitDepth()).eq(24)

        s2.to48()
        expect(s2.getSampleRate()).eq(48000)

        s2.to441()
        expect(s2.getSampleRate()).eq(44100)

    })

    it(`Trims a wave file`, async () => {
        const s = newSampleFromBuffer(await fs.readFile('test/data/mpc/Dub Tao A Kit.WAV'))
        const initialSampleCount = s.getSampleCount()
        expect(initialSampleCount).eq(655726)
        expect(s.getSampleData().length).eq(initialSampleCount * 2)

        const trimmed = s.trim(0, 10)
        expect(trimmed.getSampleCount()).eq(10)
        expect(trimmed.getSampleData().length).eq(10 * 2)
    })

    it(`Writes a wave file`, async () => {
        const tmp = tmpdir()
        const outfile = path.join(tmp, 'test.wav')

        const inbuf = await fs.readFile('test/data/mpc/Dub Tao A Kit.WAV');
        const s = newSampleFromBuffer(inbuf)
        const buf = Buffer.of(s.getSampleData().length)

        s.write(buf)
        expect(inbuf.equals(buf))

        const outstream = createWriteStream(outfile)
        await s.writeToStream(outstream)

        const re = newSampleFromBuffer(await fs.readFile(outfile))
        expect(re.getSampleCount()).eq(s.getSampleCount())
        expect(re.getSampleData().length).eq(s.getSampleData().length)
    })

})