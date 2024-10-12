import {assert, expect} from 'chai'
import fs from "fs/promises";
import {newHeaderChunk, newOutputChunk, newProgramChunk, newTuneChunk} from "../lib";

describe('Basics...', async () => {
    it('Does the basics...', async () => {
        assert.equal(0, 0)
    })
    it('Parses a program file', async () => {
        const testFile = 'test/data/BASS.AKP'
        const buf = await fs.readFile(testFile)
        let offset = 0

        // Parse header
        const header = newHeaderChunk()
        offset = header.read(buf, offset)
        expect(offset).to.be.greaterThan(0)
        expect(offset).to.equal(header.length)

        // Parse program chunk
        const program = newProgramChunk()
        offset = program.read(buf, offset)
        expect(program.programNumber).to.equal(0)
        expect(program.keygroupCount).to.equal(1)

        const output = newOutputChunk()
        offset = output.read(buf, offset)
        expect(output.length).to.equal(8)
        expect(output.loudness).to.equal(80)
        expect(output.ampMod1).to.equal(0)
        expect(output.ampMod2).to.equal(0)
        expect(output.panMod1).to.equal(0)
        expect(output.panMod2).to.equal(0)
        expect(output.panMod3).to.equal(0)
        expect(output.velocitySensitivity).to.equal(0)

        const tune = newTuneChunk()
        offset = tune.read(buf, offset)
        expect(tune.semiToneTune).to.equal(0)
        expect(tune.fineTune).to.equal(0)
        expect(tune.detuneA).to.equal(0)
        expect(tune.detuneBFlat).to.equal(0)
        expect(tune.detuneB).to.equal(0)
        expect(tune.detuneC).to.equal(0)
        expect(tune.detuneCSharp).to.equal(0)
        expect(tune.detuneD).to.equal(0)
        expect(tune.detuneEFlat).to.equal(0)
        expect(tune.detuneE).to.equal(0)
        expect(tune.detuneF).to.equal(0)
        expect(tune.detuneFSharp).to.equal(0)
        expect(tune.detuneG).to.equal(0)
        expect(tune.pitchBendUp).to.equal(2)
        expect(tune.pitchBendDown).to.equal(2)
        expect(tune.bendMode).to.equal(0)
        expect(tune.aftertouch).to.equal(0)
    })
})
