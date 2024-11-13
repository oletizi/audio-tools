import {describe, it} from 'mocha'
import {WebMidi} from 'webmidi'
import {expect} from "chai";
import {newServerOutput} from "../src/ts/process-output";
import {Midi} from "../src/ts/midi/midi";
import {newS56kDevice, newVirtualS5000} from "../src/ts/midi/device";

const out = newServerOutput()
describe('Device', async () => {
    after(async () => {
        out.log('Disabling MIDI...')
        await WebMidi.disable()
        out.log('MIDI disabled!');
    })

    it('Initializes', async () => {
        let calledBack = false
        const midi = new Midi(out)
        await midi.start(() => {
            calledBack = true
        })
        expect(calledBack).true
        expect((await midi.getOutputs()).length).gte(1)
    })

    it ('Sysex', async () => {
        const midi = new Midi(out)
        const vs5k = newVirtualS5000(midi, out)

        await midi.start(async () => {
            (await midi.getOutputs()).forEach((output) => out.log(`Output: ${output.name}`))
            out.log(`Current output: ${(await midi.getCurrentOutput()).name}`)
            out.log(`Current input: ${(await midi.getCurrentInput()).name}`)
            if (! await midi.setOutputByName('IAC Driver Bus 1')) {
                throw new Error("No suitable MIDI output.")
            }
            vs5k.init()
            midi.addListener('sysex', async () => {

            })
        })
        const sampler = newS56kDevice(midi, out)
        const program = sampler.getCurrentProgram()
        const output = program.getOutput()
        await output.getAmpMod1Source()
    })

})