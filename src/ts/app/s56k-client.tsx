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
        writeMidiOutputList()
    })
}

function writeMidiOutputList() {
    const items = []
    midi.getOutputs().then((outs: Output[]) => {
        outs.forEach((item) => {
            const onClick = () => {
                console.log(`Setting output to ${item.name}`)
                midi.setOutput(item)
                writeMidiOutputList()
            }
            const classes = ['list-group-item']
            if (!midi.isCurrentOutput(item.name)) {
                classes.push('list-group-item-active')
            } else {
                midiOutputSelectButton.render(<div><span className={'fw-bold'}>Midi Output |</span>
                    <span> {item.name}</span></div>)
                classes.push(`active`)
            }

            items.push(<li className={classes.join(' ')}
                           key={item.name}
                           onClick={onClick}
                           data-bs-toggle="collapse"
                           data-bs-target="#midi-output-view">{item.name}</li>)
        })
    })
    midiOutputListRoot.render(<ul className={'list-group'}>{items}</ul>)
}
