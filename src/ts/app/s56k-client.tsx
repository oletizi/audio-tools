import {Midi} from "../midi/midi"
import {Output} from "webmidi"
import 'bootstrap'
import {createRoot} from "react-dom/client";
import React from 'react';

const midi = new Midi()
const midiOutputListRoot = createRoot(document.getElementById('midi-output-list'))
doIt().then().catch(err => console.error(err))

async function doIt() {

    await midi.start(() => {
        console.log(`Midi started!!!!`)
        const items = []
        midi.getOutputs().then((outs: Output[]) => {
            outs.forEach((item) => items.push(<li className={'list-group-item list-group-item-action'}
                                                  data-bs-toggle="collapse"
                                                  data-bs-target="#midi-output-view">{item.name}</li>))
        })
        midiOutputListRoot.render(<ul className={'list-group'}>{items}</ul>)
    })

}
