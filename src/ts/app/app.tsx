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
import {newS56kDevice, ProgramInfo} from "../midi/device";

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

interface ProgramData {
    info: ProgramInfo
}

interface AppData {
    midiOutputs: Selectable
    midiInputs: Selectable
    program: ProgramData
}

function MidiDeviceSelect({name, label, value, onSelect, options}) {
    const [selected, setSelected] = useState(desanitize(value))
    return (
        <SlDropdown>
            <SlButton slot={'trigger'} caret>{label + ': ' + selected}</SlButton>
            <SlMenu onSlSelect={(event) => {
                let selectedDevice = desanitize(event.detail.item.value);
                setSelected(selectedDevice);
                onSelect(selectedDevice)
            }} name={name} value={value}>
                {options.map(d => (<SlMenuItem key={d.name} name={d.name} value={d.value}>{d.name}</SlMenuItem>))}
            </SlMenu>
        </SlDropdown>
    )
}

function ProgramInfoView({info}) {
    return(<div>Put Program info here.</div>)
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
                    <MidiDeviceSelect
                        name="midi-input"
                        label="MIDI Input"
                        value={data.midiInputs.value}
                        options={data.midiInputs.options}
                        onSelect={data.midiInputs.onSelect}
                    />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ProgramInfoView info={data.program.info}/>
                </Col>
            </Row>
        </Container>
    )
}


const common = newClientCommon('status')
const appRoot = createRoot(document.getElementById('app'))
const midi = new Midi()
const device = newS56kDevice(midi, common.getOutput())
midi.start(async () => {
    const rcfg = await common.fetchConfig()
    if (rcfg.error) {
        common.status(rcfg.error)
        return
    }
    const cfg = rcfg.data as ClientConfig
    await midi.setOutputByName(cfg.midiOutput)
    await midi.setInputByName(cfg.midiInput)

    device.init()
    const program = device.getCurrentProgram()
    const programInfoResult = await (program.getInfo())
    if (programInfoResult.errors.length > 0) {
        common.status(programInfoResult.errors.join(' '))
    }
    async function midiDeviceData(outputs: boolean) {
        return {
            value: sanitize(outputs ? (await midi.getCurrentOutput()).name : (await midi.getCurrentInput()).name),
            onSelect: (deviceName) => {
                outputs ? midi.setOutputByName(deviceName) : midi.setInputByName(deviceName)
                outputs ? cfg.midiOutput = deviceName : cfg.midiInput = deviceName
                common.saveConfig(cfg)
            },
            options: (outputs ? await midi.getOutputs() : await midi.getInputs()).map(device => {
                return {
                    name: device.name,
                    active: outputs ? midi.isCurrentOutput(device.name) : midi.isCurrentInput(device.name),
                    value: sanitize(device.name)
                } as Option
            })
        } as Selectable
    }

    const data = {
        midiOutputs: await midiDeviceData(true),
        midiInputs: await midiDeviceData(false),
        program: {
            info: programInfoResult.data
        }
    } as AppData
    appRoot.render(<App data={data}/>)
}).catch(e => appRoot.render(<div>Fail. ${e.message}</div>))
