import {createRoot} from "react-dom/client"
import React, {useState} from 'react'
import '@shoelace-style/shoelace/dist/themes/light.css'
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js"
import SlSelect from "@shoelace-style/shoelace/dist/react/select/index.js";
import SlOption from '@shoelace-style/shoelace/dist/react/option/index.js'
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js"
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js"
import SlRadio from "@shoelace-style/shoelace/dist/react/radio/index.js"
import {Col, Container, Row} from "react-bootstrap"
import {Midi} from "../midi/midi"
import {newClientCommon} from "./client-common"
import {ClientConfig} from "./config-client"
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js"
import SlDetails from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js";
import SlTabGroup from "@shoelace-style/shoelace/dist/react/tab-group/index.js"
import SlTab from "@shoelace-style/shoelace/dist/react/tab/index.js"
import SlTabPanel from "@shoelace-style/shoelace/dist/react/tab-panel/index.js"
import SlInput from "@shoelace-style/shoelace/dist/react/input/index.js";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number/index.js";
import {newS56kDevice, ProgramInfo, ProgramOutputInfo} from "../midi/device"

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
    output: ProgramOutputInfo
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

function ProgramView({program}: { program: ProgramData }) {
    return (
        <SlTabGroup>
            <SlTab slot="nav" panel="output">Program Output</SlTab>
            <SlTab slot="nav" panel="info">Program Info</SlTab>
            <SlTabPanel name="output"><ProgramOutputView output={program.output}/></SlTabPanel>
            <SlTabPanel name="info"><ProgramInfoView info={program.info}/></SlTabPanel>
        </SlTabGroup>
    )
}

function ProgramOutputView({output}: { output: ProgramOutputInfo }) {
    const colSize = 2
    return (<div>
        <Row>
            <Col lg={colSize}>Amp Mod 1 Source:</Col>
            <Col>
                <SlFormatNumber value={output.ampMod1Source.value}/>
                <SlRange
                    value={output.ampMod1Source.value}
                    onSlChange={async (event) => {
                        const value = (event.target as any).value
                        const result = await output.ampMod1Source.mutator(value)
                        console.log(`Result: errors: ${result.errors.length}; data: ${result.data}`)
                    }
                    }
                />
            </Col>
        </Row>
        <Row>
            <Col lg={colSize}>Amp Mod 2 Source:</Col>
            <Col><SlFormatNumber value={output.ampMod2Source.value}/></Col>
        </Row>
    </div>)
}

function ProgramInfoView({info}: { info: ProgramInfo }) {
    const colSize = 2
    return (
        <div>
            <Row>
                <Col lg={colSize}>Name: </Col>
                <Col><SlInput
                    name="program-name"
                    value={info.name.value}
                    onSlChange={(event) => info.name.mutator((event.target as any).value)}/>
                </Col>
            </Row>
            <Row>
                <Col lg={colSize}>Id:</Col>
                <Col><SlFormatNumber value={info.id}/></Col>
            </Row>
            <Row>
                <Col lg={colSize}>Index:</Col>
                <Col><SlFormatNumber value={info.index}/></Col>
            </Row>
            <Row>
                <Col lg={colSize}>Keygroup Count:</Col>
                <Col><SlFormatNumber value={info.keygroupCount}/></Col>
            </Row>
        </div>
    )
}

export default function App({data}: { data: AppData }) {
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
                    <ProgramView program={data.program}/>
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
    const programInfoResult = await program.getInfo()
    const programOutputResult = await program.getOutput().getInfo()
    const errors: Error[] = programInfoResult.errors
        .concat(programOutputResult.errors)
    if (errors.length > 0) {
        common.error(errors)
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
            info: programInfoResult.data,
            output: programOutputResult.data
        }
    } as AppData
    appRoot.render(<App data={data}/>)
}).catch(e => appRoot.render(<div>Fail. ${e.message}</div>))
