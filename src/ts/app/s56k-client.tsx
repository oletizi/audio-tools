import {MidiOutputList, MidiOutputSelectButton, MidiOutputSpec} from "./s56k-components";
import {Midi} from "../midi/midi"
import {Output} from "webmidi"
import 'bootstrap'
import {createRoot} from "react-dom/client";
import React from 'react';

const midi = new Midi()
const midiOutputSelectButton = createRoot(document.getElementById('midi-output-select-button'))
const midiOutputListRoot = createRoot(document.getElementById('midi-output-list'))
doIt().then().catch(err => console.error(err))

async function doIt() {

    await midi.start(async () => {
        await writeMidiOutputList()
    })
}

async function writeMidiOutputList() {
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
                writeMidiOutputList()
            }
        } as MidiOutputSpec
    })
    midiOutputSelectButton.render(MidiOutputSelectButton(current))
    midiOutputListRoot.render(MidiOutputList(specs))
}
