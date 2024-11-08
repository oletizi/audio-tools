import {describe, it} from 'mocha'
import {Midi} from "../src/ts/midi/midi";

describe('MIDI', async () => {
    it('Initializes', async() => {
        const midi = new Midi()
        await midi.start(
            () => {
                console.log(`Here!`)
                midi.stop()
            }
        )
    })
})
