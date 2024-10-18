import {translate} from '../src/ts/translate-lib'
import {newProgramFromBuffer} from "../src/ts/akai-lib";
import fs from "fs/promises";
import {expect} from "chai";

describe(`Translate`, async () => {
    it('Converts MPC drum program to Akai Sx000 program.', async () => {
        const infile = 'test/data/akai/Oscar/Oscar.xpm'
        const outdir = 'build'
        await translate.mpc2Sxk(infile, outdir)
        const buf = await fs.readFile('build/Oscar.AKP')
        const program = newProgramFromBuffer(buf)
        let midiNote = 60
        let detune = 0
        expect(program.getKeygroupCount()).to.eq(16)
        for (const keygroup of program.getKeygroups()) {
            expect(keygroup.zone1.sampleName).to.exist
            expect(keygroup.kloc.lowNote).to.eq(midiNote)
            expect(keygroup.kloc.highNote).to.eq(midiNote)
            expect(keygroup.kloc.semiToneTune).to.eq(detune)
            const cleanupPath = `build/${keygroup.zone1.sampleName}.WAV`
            console.log(`low note: ${keygroup.kloc.lowNote}`)
            console.log(`hi note : ${keygroup.kloc.highNote}`)
            console.log(`detune  : ${keygroup.kloc.semiToneTune}`)
            console.log(`Cleanup: ${cleanupPath}`)
            await fs.rm(cleanupPath)
            midiNote++
            detune--
        }
    })
})