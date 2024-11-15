/**
 * Components specific to the Akai S5000/S6000 sampler series
 */
import { ProgramInfo, ProgramOutputInfo} from "../midi/device";
import React, {useState} from "react";
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js";
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js";
import SlTabGroup from "@shoelace-style/shoelace/dist/react/tab-group/index.js";
import SlTab from "@shoelace-style/shoelace/dist/react/tab/index.js";
import SlTabPanel from "@shoelace-style/shoelace/dist/react/tab-panel/index.js";
import SlInput from "@shoelace-style/shoelace/dist/react/input/index.js";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number/index.js";
import {Col, Row} from "react-bootstrap";
import {MutableNumber} from "../lib/lib-core";
import {Selectable} from "./components-common";


interface ProgramData {
    info: ProgramInfo
    output: ProgramOutputInfo
}

export interface AppData {
    midiOutputs: Selectable
    midiInputs: Selectable
    program: ProgramData
}

export function ProgramView({program}: { program: ProgramData }) {
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
        <ModSourceView source={output.ampMod1Source} label={'Amp Mod 1 Source'}/>
        <ModSourceView source={output.ampMod2Source} label={'Amp Mod 2 Source'}/>
        <ModSourceView source={output.panMod1Source} label={'Pan Mod 1 Source'}/>
        <ModSourceView source={output.panMod1Source} label={'Pan Mod 2 Source'}/>
        <ModSourceView source={output.panMod1Source} label={'Pan Mod 3 Source'}/>
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

function ModSourceView({source, label}: { source: MutableNumber, label: string }) {
    const [selected, setSelected] = useState(source.value.toString())
    const names = {
        0: 'No Source',
        1: 'Modwheel',
        2: 'Pitch Bend',
        3: 'Aftertouch',
        4: 'External',
        5: 'Velocity',
        6: 'Keyboard',
        7: 'LFO 1',
        8: 'LFO 2',
        9: 'Amp Envelope',
        10: 'Filter Envelope',
        11: 'Aux Envelope',
        12: '+Modwheel',
        13: '+Pitch Bend',
        14: '+External'
    }
    return (
        <SlDropdown>
            <SlButton slot={'trigger'} value={source.value.toString()} caret>
                <span className={'fw-bold'}>{label + ': '}</span> <span>{names[selected]}</span></SlButton>
            <SlMenu onSlSelect={async (event) => {
                const val = event.detail.item.value
                setSelected(val)
                // XXX: TODO: Handle errors here
                const result = await source.mutator(Number.parseInt(val))
            }}>
                {Object.getOwnPropertyNames(names)
                    .map(val => <SlMenuItem
                        key={label + val}
                        name={names[val]}
                        value={val}>{names[val]}</SlMenuItem>)}
            </SlMenu>
        </SlDropdown>
    )
}