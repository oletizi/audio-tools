import {MidiOutputSelect, MidiOutputSpec} from "./components-s56k";
import {Midi} from "../midi/midi"
import 'bootstrap'
import {createRoot} from "react-dom/client";
import {ClientConfig, newNullClientConfig} from "./config-client";
import {newClientCommon} from "./client-common";

const clientCommon = newClientCommon('status')
const output = clientCommon.getOutput()
const midi = new Midi()
const midiOutputSelectRoot = createRoot(document.getElementById('midi-output-select'))


class ClientS56k {
    private cfg: ClientConfig = newNullClientConfig()

    async init() {
        const result = await clientCommon.fetchConfig()
        if (result.error) {
            clientCommon.status(result.error)
            output.error(result.error)
        } else {
            this.cfg = result.data
        }

        await midi.start(async () => {
            if (this.cfg.midiOutput && this.cfg.midiOutput !== '') {
                for (const out of await midi.getOutputs()) {
                    if (out.name === this.cfg.midiOutput) {
                        midi.setOutput(out)
                    }
                }
            }
            await this.updateMidiOutputSelect()
        })
    }

    async updateMidiOutputSelect() {
        const specs = (await midi.getOutputs()).map(out => {
            return {
                output: out,
                isActive: midi.isCurrentOutput(out.name),
                action: async () => {
                    output.log(`You clicked me: ${out.name}`)
                    clientCommon.status(`You chose ${out.name}`)
                    output.log(`Setting midi output to ${out.name}`)
                    midi.setOutput(out)
                    output.log(`Setting cfg.midiOutput to ${out.name}`)
                    this.cfg.midiOutput = out.name
                    try {
                        output.log(`Saving config...`)
                        const result = await clientCommon.saveConfig(this.cfg)
                        if (result.error) {
                            output.log(`Error saving config: ${result.error}`)
                        } else {
                            output.log(`Done saving config.`)
                        }
                    } catch (err) {
                        output.log(`Barfed trying to save config: ${err.message}`)
                        clientCommon.status(err.message)
                    }
                    output.log(`Updating midi output select..`)
                    await this.updateMidiOutputSelect()
                    console.log(`Done updating midi output select.`)
                }
            } as MidiOutputSpec
        })
        midiOutputSelectRoot.render(MidiOutputSelect(specs))
    }
}

const c56k = new ClientS56k()
c56k.init()
    .then(() => clientCommon.status(`Initialized.`))
    .catch(err => {
        clientCommon.status(`error: ${err.message}`)
        output.error(err)
    })

