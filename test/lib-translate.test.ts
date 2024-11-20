import {translate} from '@/lib/lib-translate'
import {newProgramFromBuffer} from "@/lib/lib-akai-s56k"
import fs from "fs/promises"
import {expect} from "chai"
import path from "path"

describe(`Translate`, async () => {
    let cleanup = false
    it('Converts MPC drum program to Akai Sx000 program.', async () => {
        const infile = 'test/data/mpc/Oscar/Oscar.xpm'
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
            if (cleanup) {
                await fs.rm(cleanupPath)
            }
            midiNote++
            detune--
        }
    })
    it('Checks itself', async () => {
        const buf = await fs.readFile('test/data/Sx000/Oscar/Oscar-unmuted.AKP')
        const program = newProgramFromBuffer(buf)
    })
    it('Converts decent sampler program to Akai Sx000 program', async () => {
        const infile = path.join('test', 'data', 'decent', 'Oscar.dspreset')
        const outdir = path.join('build')
        const outfile = path.join(outdir, 'Oscar.AKP')
        // const program = decent.newProgramFromBuffer(await fs.readFile(infile))
        await translate.decent2Sxk(infile, outdir)

        const program = newProgramFromBuffer(await fs.readFile(outfile))
        expect(program).to.exist
    })

    it( 'Handles decent sampler programs with velocity zones', async () => {
        const infile = path.join('test','data', 'decent', 'multizone.dspreset')
        const outdir = 'build'
        const outfile = path.join(outdir, 'multizone.AKP')
        let result = await translate.decent2Sxk(infile, outdir);
        expect(result.errors.length).eq(90) // one error for each missing sample file
        const program = result.data
        expect(program).exist
    })
})