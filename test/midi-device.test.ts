import {describe, it} from 'mocha'
import {WebMidi} from 'webmidi'
import {newServerOutput} from "../src/ts/process-output";
import {assert, expect} from "chai";
import {Midi} from "../src/ts/midi/midi";
import {newS56kDevice} from "../src/ts/midi/device";

const out = newServerOutput()


const tests = [testInitialize, testSysex]
describe('Device', async () => {
    it('Midi tests', () => {
        return new Promise((resolve, reject) => {
            WebMidi.enable({
                sysex: true,
                callback: async () => {
                    try {
                        out.log(`Midi enabled. Running tests...`)
                        let count = 0
                        for (const test of tests) {
                            out.log(`Running test...`)
                            count++
                            await test()
                            out.log(`test complete.`)
                        }
                        out.log(`Ran ${count} test(s).`)
                        resolve()
                    } catch (err) {
                        reject(err)
                    } finally {
                        await WebMidi.disable()
                    }
                }
            })
        })
    })
})

async function testInitialize() {
    const midi = new Midi(out)
    expect((await midi.getOutputs()).length).gte(1)
}

async function testSysex() {
    const midi = new Midi(out)
    if((await midi.setOutputByName('Model 12 MIDI OUT')) && (await midi.setInputByName('Model 12 MIDI IN'))) {
        const d = newS56kDevice(midi, out)
        d.init()
        await d.ping()
    } else {
        out.log(`Can't find necessary midi ins and outs.`)
    }

}