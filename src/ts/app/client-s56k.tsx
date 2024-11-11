import 'bootstrap'
import {createRoot, Root} from "react-dom/client";
import {MidiDeviceSelect, MidiDeviceSpec, ProgramInfoView} from "./components-s56k";
import {Midi} from "../midi/midi"
import {ClientConfig, newNullClientConfig} from "./config-client";
import {newClientCommon} from "./client-common";
import {MidiInstrument, newMidiInstrument} from "../midi/instrument";
import {newS56kDevice, ProgramInfoResult, S56kDevice} from "../midi/device";

const clientCommon = newClientCommon('status')
const output = clientCommon.getOutput()
const midi = new Midi()
const midiOutputSelectRoot = createRoot(document.getElementById('midi-output-select'))
const midiInputSelectRoot = createRoot(document.getElementById('midi-input-select'))
const programInfoRoot = createRoot(document.getElementById('program-info'))

class ClientS56k {
    private cfg: ClientConfig = newNullClientConfig()
    private device: S56kDevice

    async init() {
        let result = await clientCommon.fetchConfig()
        let instrument: MidiInstrument
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
            if (this.cfg.midiInput && this.cfg.midiInput !== '') {
                for (const input of await midi.getInputs()) {
                    if (input.name === this.cfg.midiInput) {
                        midi.setInput(input)
                    }
                }
            }
            this.device = newS56kDevice(midi, output)
            this.device.init()
            instrument = newMidiInstrument(midi, 1)
            await updateMidiDeviceSelect(
                midiOutputSelectRoot,
                async () => (await midi.getOutputs()).map((output) => output.name),
                async (name) => midi.isCurrentOutput(name),
                async (name) => {
                    await midi.setOutputByName(name)
                    this.cfg.midiOutput = name
                    await saveConfig(this.cfg)
                },
                'Midi Out: '
            )
            await updateMidiDeviceSelect(
                midiInputSelectRoot,
                async () => (await midi.getInputs()).map((input) => input.name),
                async (name) => midi.isCurrentInput(name),
                async (name) => {
                    await midi.setInputByName(name)
                    this.cfg.midiInput = name
                    await saveConfig(this.cfg)
                },
                'Midi In: '
            )
        })

        const playButton = document.getElementById('play-button')
        playButton.onclick = () => {
            instrument.noteOn(60, 127)
        }

        const sysexButton = document.getElementById('sysex-button')
        sysexButton.onclick = async () => {
            const response = await this.device.ping()
            clientCommon.status(response.message)
        }
        const programCountButton = document.getElementById('program-count-button')
        programCountButton.onclick = async () => {
            const response = await this.device.getProgramCount()
            clientCommon.status(response.errors.length > 0 ? `Error: ${response.errors[0].message}` : `Program count: ${response.data}`)
        }

        const r: ProgramInfoResult = await this.device.getCurrentProgram().getInfo();
        if (r.errors.length > 0) {
            programInfoRoot.render(<div>Yikes! Errors: {r.errors.map(e => e.message).join('; ')}</div>)
        } else {
            programInfoRoot.render(ProgramInfoView(r.data))
        }
    }

}

async function saveConfig(cfg) {
    try {
        const result = await clientCommon.saveConfig(cfg)
        if (result.error) {
            output.log(`Error saving config: ${result.error}`)
        } else {
            output.log(`Done saving config.`)
        }
    } catch (err) {
        output.log(`Barfed trying to save config: ${err.message}`)
        clientCommon.status(err.message)
    }
}

async function updateMidiDeviceSelect(root: Root, getNames: Function, isCurrent: Function, selected: Function, label: string = 'Midi Out: ') {
    output.log(`Updating midi device select...`)
    const specs = []
    for (const name of (await getNames())) {
        output.log(`Creating spec for device: ${name}`)
        specs.push({
            name: name,
            isActive: await isCurrent(name),
            action: async () => {
                clientCommon.status(`You chose ${name}`)
                await selected(name)
                output.log(`Updating midi device select..`)
                await updateMidiDeviceSelect(root, getNames, isCurrent, selected, label)
                output.log(`Done updating midi device select.`)
            }
        } as MidiDeviceSpec)
    }
    output.log(`Specs: ${JSON.stringify(specs)}`)
    root.render(MidiDeviceSelect(specs, label))
}

const c56k = new ClientS56k()
c56k.init()
    .then(() => clientCommon.status(`Initialized.`))
    .catch(err => {
        clientCommon.status(`error: ${err.message}`)
        output.error(err)
    })

