import {assert, expect} from 'chai'
import fs from "fs/promises";
import {
    bytes2Number,
    newHeaderChunk, newKeygroupChunk,
    newLfo1Chunk, newLfo2Chunk, newModsChunk,
    newOutputChunk,
    newProgramChunk,
    newTuneChunk, OutputChunk,
    parseChunkHeader, ProgramChunk
} from "../lib";
describe('Basics...', async () => {
    it('Does the basics...', () => {
        assert.equal(0, 0)
    })
    it('Converts bytes to number...', () => {
        const bytes = [0x6, 0, 0, 0]
        assert.equal(bytes2Number(bytes), 6)
    })

    it('Parses a chunk header...', () => {
        const buf = Buffer.from([
            0x6f, 0x75, 0x74, 0x20, // 'out '
            0x08, 0x00, 0x00, 0x00   //  8
        ])
        const chunk = newOutputChunk()
        const bytesRead = parseChunkHeader(buf, chunk, 0)
        expect(bytesRead).to.eq(8)
        expect(chunk.name).to.eq('out ')
        expect(chunk.length).to.eq(8)
    })

    it('Parses a program file', async () => {
        const testFile = 'test/data/BASS.AKP'
        const buf = await fs.readFile(testFile)
        let offset = 0

        // Parse header
        const header = newHeaderChunk()
        offset += header.parse(buf, offset)
        expect(offset).to.be.greaterThan(0)

        // Parse program chunk
        const program: ProgramChunk = newProgramChunk()
        offset += program.parse(buf, offset)
        expect(program.programNumber).to.equal(0)
        expect(program.keygroupCount).to.equal(1)

        const output: OutputChunk = newOutputChunk()
        offset += output.parse(buf, offset)
        expect(output.loudness).to.equal(80)
        expect(output.ampMod1).to.equal(0)
        expect(output.ampMod2).to.equal(0)
        expect(output.panMod1).to.equal(0)
        expect(output.panMod2).to.equal(0)
        expect(output.panMod3).to.equal(0)
        expect(output.velocitySensitivity).to.equal(0)

        const tune = newTuneChunk()
        offset += tune.parse(buf, offset)
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

        const lfo1 = newLfo1Chunk()
        offset += lfo1.parse(buf, offset)
        expect(lfo1.name).to.eq('lfo ')
        expect(lfo1.waveform).to.eq(1)
        expect(lfo1.rate).to.eq(43)
        expect(lfo1.delay).to.eq(0)
        expect(lfo1.depth).to.eq(0)
        expect(lfo1.sync).to.eq(0)
        expect(lfo1.modwheel).to.eq(15)
        expect(lfo1.aftertouch).to.eq(0)
        expect(lfo1.rateMod).to.eq(0)
        expect(lfo1.delayMod).to.eq(0)
        expect(lfo1.depthMod).to.eq(0)

        const lfo2 = newLfo2Chunk()
        offset += lfo2.parse(buf, offset)
        expect(lfo2.name).to.eq('lfo ')
        expect(lfo2.waveform).to.eq(0)
        expect(lfo2.rate).to.eq(0)
        expect(lfo2.delay).to.eq(0)
        expect(lfo2.depth).to.eq(0)
        expect(lfo2.retrigger).to.eq(0)
        expect(lfo2.rateMod).to.eq(0)
        expect(lfo2.depthMod).to.eq(0)

        const mods = newModsChunk()
        offset += mods.parse(buf, offset)
        expect(mods.name).to.eq('mods')
        expect(mods.ampMod1Source).to.eq(6)
        expect(mods.ampMod2Source).to.eq(3)
        expect(mods.panMod1Source).to.eq(8)
        expect(mods.panMod2Source).to.eq(6)
        expect(mods.panMod3Source).to.eq(1)
        expect(mods.lfo1RateModSource).to.eq(6)
        expect(mods.lfo1DelayModSource).to.eq(6)
        expect(mods.lfo1DepthModSource).to.eq(6)
        expect(mods.lfo2RateModSource).to.eq(0)
        expect(mods.lfo2DelayModSource).to.eq(0)
        expect(mods.lfo2DepthModSource).to.eq(0)
        expect(mods.pitchMod1Source).to.eq(7)
        expect(mods.pitchMod2Source).to.eq(11)
        expect(mods.ampModSource).to.eq(5)
        expect(mods.filterModInput1).to.eq(5)
        expect(mods.filterModInput2).to.eq(8)
        expect(mods.filterModInput3).to.eq(9)

        const keygroup = newKeygroupChunk()
        offset += keygroup.parse(buf, offset)
        expect(keygroup.name).to.eq('kgrp')
        expect(keygroup.kloc).to.exist

        const kloc = keygroup.kloc
        expect(kloc.name).to.eq('kloc')
        expect(kloc.lowNote).to.eq(21)
        expect(kloc.highNote).to.eq(127)
        expect(kloc.semiToneTune).to.eq(0)
        expect(kloc.fineTune).to.eq(0)
        expect(kloc.overrideFx).to.eq(0)
        expect(kloc.pitchMod1).to.eq(100)
        expect(kloc.pitchMod2).to.eq(0)
        expect(kloc.ampMod).to.eq(0)
        expect(kloc.zoneXFade).to.eq(0)
        expect(kloc.muteGroup).to.eq(0)

        expect(keygroup.ampEnvelope).to.exist
        const ampenv = keygroup.ampEnvelope
        expect(ampenv.name).to.eq('env ')
        expect(ampenv.attack).to.eq(1)
        expect(ampenv.decay).to.eq(50)
        expect(ampenv.sustain).to.eq(100)
        expect(ampenv.velocity2Attack).to.eq(0)
        expect(ampenv.onVelocity2Release).to.eq(0)
        expect(ampenv.offVelocity2Release).to.eq(0)

        expect(keygroup.filterEnvelope).to.exist
        const filtenv = keygroup.filterEnvelope
        expect(filtenv.name).to.eq('env ')
        expect(filtenv.attack).to.eq(3)
        expect(filtenv.decay).to.eq(74)
        expect(filtenv.sustain).to.eq(68)
        expect(filtenv.release).to.eq(0)
        expect(filtenv.depth).to.eq(7)
        expect(filtenv.velocity2Attack).to.eq(0)
        expect(filtenv.keyscale).to.eq(0)
        expect(filtenv.onVelocity2Release).to.eq(0)
        expect(filtenv.offVelocity2Release).to.eq(0)

        expect(keygroup.auxEnvelope).to.exist
        const auxenv = keygroup.auxEnvelope
        expect(auxenv.name).to.eq('env ')
        expect(auxenv.rate1).to.eq(0)
        expect(auxenv.rate2).to.eq(50)
        expect(auxenv.rate3).to.eq(50)
        expect(auxenv.rate4).to.eq(15)
        expect(auxenv.level1).to.eq(100)
        expect(auxenv.level2).to.eq(100)
        expect(auxenv.level3).to.eq(100)
        expect(auxenv.level4).to.eq(0)
        expect(auxenv.velocity2Rate1).to.eq(0)
        expect(auxenv.keyboard2Rate2and4).to.eq(0)
        expect(auxenv.velocity2Rate4).to.eq(0)
        expect(auxenv.offVelocity2Rate4).to.eq(0)
        expect(auxenv.velocity2OutLevel).to.eq(0)

        expect(keygroup.filter).to.exist
        const filt = keygroup.filter
        expect(filt.name).to.eq('filt')
        expect(filt.mode).to.eq(0)
        expect(filt.cutoff).to.eq(53)
        expect(filt.resonance).to.eq(7)
        expect(filt.keyboardTrack).to.eq(6)
        expect(filt.modInput1).to.eq(0)
        expect(filt.modInput2).to.eq(0)
        expect(filt.modInput3).to.eq(0)
        expect(filt.headroom).to.eq(0)
    })
})
