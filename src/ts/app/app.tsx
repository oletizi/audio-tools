import {createRoot} from "react-dom/client"
import React from 'react'
import '@shoelace-style/shoelace/dist/themes/light.css'
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import SlSelect from "@shoelace-style/shoelace/dist/react/select/index.js";
import SlOption from '@shoelace-style/shoelace/dist/react/option/index.js'
import {Col, Container, Row} from "react-bootstrap";
import {Midi} from "../midi/midi";

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/')

interface Option {
    name: string
    value: string
    active: boolean
}

interface MidiDevice extends Option {

}

interface Selectable {
    value: string
    onSelect: Function
    options: Option[]
}

interface AppData {
    midiOutputs: Selectable
    midiInputs: Selectable
}

function MidiDeviceSelect({name, label, value, onSelect, options}) {
    return (
        <SlSelect
            onSlInput={onSelect}
            name={name}
            label={label}
            value={value}>
            {options.map(d => (<SlOption key={d.name} value={d.value}>{d.name}</SlOption>))}
        </SlSelect>
    )
}

export default function App({data}) {
    return (
        <Container>
            <Row>
                <Col>
                    <h1>S5000/S6000 Control</h1>
                    <MidiDeviceSelect
                        name="midi-output"
                        label="MIDI Output"
                        value={data.midiOutputs.value}
                        options={data.midiOutputs.options}
                        onSelect={data.midiOutputs.onSelect}/>
                </Col>
            </Row>
        </Container>
    )
}


const appRoot = createRoot(document.getElementById('app'))
const midi = new Midi()


midi.start(async () => {
    const data = {
        midiOutputs: {
            onSelect: (event) => {
                console.log(`SELECTED: ${(event.target as any).value}`)
                midi.setOutputByName((event.target as any).value.replaceAll('%20', ' '))
            },
            options: (await midi.getOutputs()).map(output => {
                return {
                    name: output.name,
                    active: midi.isCurrentOutput(output.name),
                    value: output.name.replaceAll(' ', '%20'),
                } as MidiDevice
            })
        } as Selectable
    }
    appRoot.render(<App data={data as AppData}/>)
}).catch(e => appRoot.render(<div>Fail. ${e.message}</div>))
