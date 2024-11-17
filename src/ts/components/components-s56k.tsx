/**
 * Components specific to the Akai S5000/S6000 sampler series
 */
import React from "react";
import {ProgramInfo, ProgramMidiTuneInfo, ProgramOutputInfo} from "@/midi/device";
import {SimpleSelect, Selectable, Option, ControlPanel, MutableSlider} from "./components-common";
import {Flex, Tabs} from '@chakra-ui/react'

import {MutableNumber} from "@/lib/lib-core";


interface ProgramData {
    info: ProgramInfo
    output: ProgramOutputInfo
    midiTune: ProgramMidiTuneInfo
}

export interface AppData {
    midiOutputs: Selectable
    midiInputs: Selectable
    program: ProgramData
}

export function ProgramView({data}: { data: ProgramData }) {
    return (

        <Tabs.Root defaultValue={'midi-tune'}>
            <Tabs.List>
                <Tabs.Trigger value={'info'}>Program Info</Tabs.Trigger>
                <Tabs.Trigger value={'output'}>Program Output</Tabs.Trigger>
                <Tabs.Trigger value={'midi-tune'}>Program MIDI/Tune</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value={'info'}>Tab content for Program Info.</Tabs.Content>
            <Tabs.Content value={'output'}> <ProgramOutputView data={data.output}/></Tabs.Content>
            <Tabs.Content value={'midi-tune'}><ProgramMidiTuneView data={data.midiTune}/></Tabs.Content>
        </Tabs.Root>
    )
}


function ProgramOutputView({data}: { data: ProgramOutputInfo }) {
    const variant = 'subtle'
    return (
        <Flex gap={4} wrap={'wrap'}>
            <ControlPanel title={'Loudness'} flexGrow={1} variant={variant}>
                <MutableSlider data={data.loudness} label={'Loudness'}/>
            </ControlPanel>
            <ControlPanel title={'Velocity Sensitivity'}>
                <MutableSlider data={data.velocitySensitivity} label={'Sensitivity'}/>
                <p>Fix me :-(</p>
                <p>I can't save my data.</p>
            </ControlPanel>
            <ControlPanel title={'Amp Mod 1'}>
                <ModSourceSelect modSource={data.ampMod1Source} label={'Source'}/>
                <MutableSlider data={data.ampMod1Value} label={'Value'}/>
            </ControlPanel>
            <ControlPanel title={'Amp Mod 2'}>
                <ModSourceSelect modSource={data.ampMod2Source} label={'Source'}/>
                <MutableSlider data={data.ampMod2Value} label={'Value'}/>
            </ControlPanel>
            <ControlPanel title={'Pan Mod 1'}>
                <ModSourceSelect modSource={data.panMod1Source} label={'Source'}/>
                <MutableSlider data={data.panMod1Value} label={'Value'}/>
            </ControlPanel>
            <ControlPanel title={'Pan Mod 2'}>
                <ModSourceSelect modSource={data.panMod2Source} label={'Source'}/>
                <MutableSlider data={data.panMod2Value} label={'Value'}/>
            </ControlPanel>
            <ControlPanel title={'Pan Mod 3'}>
                <p>Fix me :-(</p>
                <p> My data is borken.</p>
                {/*<ModSourceSelect modSource={data.panMod3Source} label={'Source'}/>*/}
                {/*<MutableSlider data={data.panMod3Value} label={'Value'}/>*/}
            </ControlPanel>
        </Flex>
    )
}

function ProgramMidiTuneView({data}: { data: ProgramMidiTuneInfo }) {
    return (
        <Flex>
            <ControlPanel title={'Semitone Tune'}>
                <MutableSlider data={data.semitoneTune} label={'Value'}/>
            </ControlPanel>
        </Flex>
    )
}

// function ProgramInfoView({info}: { info: ProgramInfo }) {
//     return (
//         <div className={'flex columns-2'}>
//             <SlInput
//                 name="program-name"
//                 value={info.name.value}
//                 onSlChange={(event) => info.name.mutator((event.target as any).value)}/>
//             <div>Id:</div>
//             <div><SlFormatNumber value={info.id}/></div>
//             <div>Index:</div>
//             <div><SlFormatNumber value={info.index}/></div>
//             <div>Keygroup Count:</div>
//             <div><SlFormatNumber value={info.keygroupCount}/></div>
//         </div>
//     )
// }


function ModSourceSelect({modSource, label}: { modSource: MutableNumber, label: string }) {
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
    return (
        <SimpleSelect
            options={Object.getOwnPropertyNames(items).map(key => {
                return {value: key, label: items[key], selected: key === "" + modSource.value} as Option
            })}
            mutator={modSource.mutator}
            label={label}
        />
    )
}