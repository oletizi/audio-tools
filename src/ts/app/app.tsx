import {createRoot} from "react-dom/client"
import React, {useState} from 'react'
import '@shoelace-style/shoelace/dist/themes/light.css'
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js";
import SlSelect from "@shoelace-style/shoelace/dist/react/select/index.js";
import SlOption from '@shoelace-style/shoelace/dist/react/option/index.js'
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js"
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js"
import SlRadio from "@shoelace-style/shoelace/dist/react/radio/index.js"
import {Col, Container, Row} from "react-bootstrap";
import {Midi} from "../midi/midi";
import {newClientCommon} from "./client-common";
import {ClientConfig} from "./config-client";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js";

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/')

function sanitize(val: string) {
    return encodeURI(val)
}

function desanitize(val: string) {
    return decodeURI(val)
}

interface Option {
    name: string
    value: string
    active: boolean
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
    const [selected, setSelected] = useState(desanitize(value))
    return (
        <SlDropdown>
            <SlButton slot={'trigger'} caret>{label + ': ' + selected}</SlButton>
            <SlMenu onSlSelect={(event) => {setSelected(desanitize(event.detail.item.value)); onSelect(event)}} name={name} value={value}>
                {options.map(d => (<SlMenuItem key={d.name} name={d.name} value={d.value}>{d.name}</SlMenuItem>))}
            </SlMenu>
        </SlDropdown>
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
    const common = newClientCommon('status')
    const rcfg = await common.fetchConfig()
    if (rcfg.error) {
        common.status(rcfg.error)
        return
    }
    const cfg = rcfg.data as ClientConfig
    await midi.setOutputByName(cfg.midiOutput)
    await midi.setInputByName(cfg.midiInput)

    const data = {
        midiOutputs: {
            value: sanitize((await midi.getCurrentOutput()).name),
            onSelect: (event) => {
                const outputName = desanitize(event.target.value)
                midi.setOutputByName(outputName)
                cfg.midiOutput = outputName
                common.saveConfig(cfg)
            },
            options: (await midi.getOutputs()).map(output => {
                return {
                    name: output.name,
                    active: midi.isCurrentOutput(output.name),
                    value: sanitize(output.name),
                } as Option
            })
        } as Selectable
    }
    appRoot.render(<App data={data as AppData}/>)
}).catch(e => appRoot.render(<div>Fail. ${e.message}</div>))
