import {newSampleFromBuffer} from "@/sample.js";
import fs from "fs/promises";
import {expect} from "chai";
import * as wavefile from "wavefile"

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
})