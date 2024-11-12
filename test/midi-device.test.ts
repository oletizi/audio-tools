import {describe, it} from 'mocha'
import {WebMidi} from 'webmidi'
import {expect} from "chai";
import {newServerOutput} from "../src/ts/process-output";
import {Midi} from "../src/ts/midi/midi";

const out = newServerOutput()
describe('Device', async () => {
    after(async () => {
        console.log('Disabling MIDI...')
        await WebMidi.disable()
        console.log('MIDI disabled!');
    })
    it('Does stuff?', async () => {
        let calledBack = false
        const midi = new Midi(out)
        await midi.start(() => {
            calledBack = true
        })
        expect(calledBack).true
        expect((await midi.getOutputs()).length).gte(1)
    })

})