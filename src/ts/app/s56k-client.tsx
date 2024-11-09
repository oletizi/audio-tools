import {MidiOutputSelect, MidiOutputSelectButton, MidiOutputSpec} from "./s56k-components";
import {Midi} from "../midi/midi"
import 'bootstrap'
import {createRoot} from "react-dom/client";

const midi = new Midi()
const midiOutputSelectRoot = createRoot(document.getElementById('midi-output-select'))
doIt().then().catch(err => console.error(err))

async function doIt() {

    await midi.start(async () => {
        await updateMidiOutputSelect()
    })
}

async function updateMidiOutputSelect() {
    let current = ''
    const specs = (await midi.getOutputs()).map(out => {
        const isActive = midi.isCurrentOutput(out.name)
        if (isActive) {
            current = out.name
        }
        return {
            output: out,
            isActive: isActive,
            action: () => {
                midi.setOutput(out);
                updateMidiOutputSelect()
            }
        } as MidiOutputSpec
    })
    midiOutputSelectRoot.render(MidiOutputSelect(specs))
}
