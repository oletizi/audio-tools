/**
 * Components specific to the Akai S5000/S6000 sampler series
 */
import {ProgramInfo, ProgramOutputInfo} from "../midi/device";
import React, {CSSProperties, useState} from "react";
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js";
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js";
import SlDivider from "@shoelace-style/shoelace/dist/react/divider/index.js";
import SlFormatNumber from "@shoelace-style/shoelace/dist/react/format-number/index.js";
import SlInput from "@shoelace-style/shoelace/dist/react/input/index.js";
import SlTabGroup from "@shoelace-style/shoelace/dist/react/tab-group/index.js";
import SlTab from "@shoelace-style/shoelace/dist/react/tab/index.js";
import SlTabPanel from "@shoelace-style/shoelace/dist/react/tab-panel/index.js";
import SlCard from "@shoelace-style/shoelace/dist/react/card/index.js";
import {MutableNumber, MutableString} from "../lib/lib-core";
import {LabeledDropdown, LabeledRange, Selectable} from "./components-common";
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js";


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
    // noinspection TypeScriptValidateTypes
    return (
        <div className={'grid lg:grid-cols-3 gap-4'}>
            <SlCard>
                <div slot={'header'}>Loudness</div>
                <LabeledRange data={output.loudness} label={''}/>
            </SlCard>
            <SlCard>
                <div slot={'header'}>Amp Mod 1</div>
                <ModSourceView modSource={output.ampMod1Source} label={'Source'}/>
                <LabeledRange data={output.ampMod1Value} label={"Value"}/>
            </SlCard>
            <SlCard>
                <div slot="header">Amp Mod 2</div>
                <ModSourceView modSource={output.ampMod2Source} label={'Source'}/>
                <LabeledRange data={output.ampMod2Value} label={"Value"}/>
            </SlCard>
            <SlCard>
                <div slot="header">Pan Mod 1</div>
                <ModSourceView modSource={output.panMod1Source} label={'Pan Mod 1 Source'}/>
            </SlCard>
            <SlCard>
                <div slot="header">Pan Mod 2</div>
                <ModSourceView modSource={output.panMod1Source} label={'Pan Mod 2 Source'}/>
            </SlCard>
            <SlCard>
                <div slot="header">Pan Mod 3</div>
                <ModSourceView modSource={output.panMod1Source} label={'Pan Mod 3 Source'}/>
            </SlCard>
        </div>
    )
}


function ProgramInfoView({info}: { info: ProgramInfo }) {
    return (
        <div className={'flex columns-2'}>
            <SlInput
                name="program-name"
                value={info.name.value}
                onSlChange={(event) => info.name.mutator((event.target as any).value)}/>
            <div>Id:</div>
            <div><SlFormatNumber value={info.id}/></div>
            <div>Index:</div>
            <div><SlFormatNumber value={info.index}/></div>
            <div>Keygroup Count:</div>
            <div><SlFormatNumber value={info.keygroupCount}/></div>
        </div>
    )
}


function ModSourceView({modSource, label}: { modSource: MutableNumber, label: string }) {
    const [selected, setSelected] = useState(modSource.value.toString())
    const items = {
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
    return (<LabeledDropdown items={items} defaultValue={modSource.value.toString()} mutator={modSource.mutator}
                             label={label}/>)
}