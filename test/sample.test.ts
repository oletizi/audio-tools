import fs from "fs/promises";
import {newSampleFromBuffer} from "../src/ts/sample";

describe('Sample', async () => {
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