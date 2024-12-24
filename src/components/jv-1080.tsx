import FormControl from "@mui/material/FormControl";
import {Box, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {Jv1080} from "@/midi/roland";
import {Mark} from "@mui/material/Slider/useSlider.types";
import {Knob} from "@/components/knob";

const FX_TYPES = [
    'STEREO-EQ',
    'OVERDRIVE',
    'DISTORTION',
    'PHASER',
    'SPECTRUM',
    'ENHANCER',
    'AUTO-WAH',
    'ROTARY',
    'COMPRESSOR',
    'LIMITER',
    'HEXA-CHORUS',
    'TREMOLO-CHORUS',
    'SPACE-D',
    'STEREO-CHORUS',
    'STEREO-FLANGER',
    'STEP-FLANGER',
    'STEREO-DELAY',
    'MODULATION-DELAY',
    'TRIPLE-TAP-DELAY',
    'QUADRUPLE-TAP-DELAY',
    'TIME-CONTROL-DELAY',
    'VOICE-PITCH-SHIFTER',
    'FBK-PITCH-SHIFTER',
    'REVERB',
    'GATE-REVERB',
    'OVERDRIVE->CHORUS',
    'OVERDRIVE->FLANGER',
    'OVERDRIVE->DELAY',
    'DISTORTION->CHORUS',
    'DISTORTION->FLANGER',
    'DISTORTION->DELAY',
    'ENHANCER->CHORUS',
    'ENHANCER->FLANGER',
    'ENHANCER->DELAY',
    'CHORUS->DELAY',
    'FLANGER->DELAY',
    'CHORUS->FLANGER',
    'CHORUS/DELAY',
    'FLANGER/DELAY',
    'CHORUS/FLANGER',
]

export function FxSelect({onSubmit}: { onSubmit: (n: number) => void }) {
    const [value, setValue] = useState("0")
    return (
        <FormControl>
            <InputLabel>Fx Select</InputLabel>
            <Select label="Fx Select" value={value} onChange={(e: SelectChangeEvent<string>) => {
                const v = Number.parseInt(e.target.value)
                setValue(e.target.value)
                onSubmit(v)
            }}>
                {FX_TYPES.map((v, i) => (<MenuItem key={'fx-select-' + i} value={i}>{v}</MenuItem>))}
            </Select>
        </FormControl>)
}

export function FxPanel({device}: { device: Jv1080 }) {
    const [fx, setFx] = useState(0)
    return (
        <Box className="flex flex-col gap-10 w-full">
            <FxSelect onSubmit={(v) => {
                device.setFx(v)
                setFx(v)
            }}/>
            {getFxPanel(device, fx)}
        </Box>)
}


function getFxPanel(device: Jv1080, fxIndex: number) {
    switch (fxIndex) {
        case 0:
            return (<StereoEqPanel device={device}/>)
        default:
            return (<div>Unsupported effect: {fxIndex}</div>)
    }
}


export function StereoEqPanel({device}: { device: Jv1080 }) {
    return (
        <div className="flex flex-col gap-10 w-1/2">
            <ControlSection>
                <ControlSlider label="Hi Boost/Cut" min={-15} max={15}
                               onChange={v => device.setFxParam(3, v + 15)}/>
                <ControlSlider label="Freq" min={0} max={1}
                               marks={[{value: 0, label: '4KHz'}, {value: 1, label: '8KHz'}]}
                               onChange={(v) => device.setFxParam(2, v)}/>
            </ControlSection>

            <ControlSection>
                <ControlSlider label="Lo Mid Boost/Cut" min={-15} max={15}
                               onChange={v => device.setFxParam(6, v + 15)}/>
                <ControlSlider label="Q" min={0} max={4}
                               marks={[
                                   {label: '0.5', value: 0},
                                   {label: '1.0', value: 1},
                                   {label: '2.0', value: 2},
                                   {label: '4.0', value: 3},
                                   {label: '9.0', value: 4}
                               ]}
                               onChange={v => device.setFxParam(5, v)}/>
                <ControlSlider label="Freq" min={0} max={15}
                               marks={[
                                   {label: 200, value: 0},
                                   {label: 250, value: 1},
                                   {label: 350, value: 2},
                                   {label: 400, value: 3},
                                   {label: 500, value: 4},
                                   {label: 630, value: 5},
                                   {label: 800, value: 6},
                                   {label: 1000, value: 7},
                               ]}
                               onChange={v => device.setFxParam(4, v)}/>
            </ControlSection>

            <ControlSection>
                <ControlSlider label="Lo Boost/Cut" min={-15} max={15}
                               onChange={v => device.setFxParam(1, v + 15)}/>
                <ControlSlider onChange={v => device.setFxParam(0, v)}
                               label="" min={0} max={1} marks={[{value: 0, label: '200Hz'}, {
                    value: 1,
                    label: '400Hz'
                }]}/>
            </ControlSection>
        </div>)
}

function ControlSection({children}) {
    return (<Stack className="border-2 p-10 rounded">{children}</Stack>)
}

function ControlSlider({onChange, label, min, max, defaultValue = 0, marks = null}: {
    onChange: (v: number) => void,
    label: string,
    min: number,
    max: number,
    defaultValue?: number
    marks?: null | Mark[]
}) {
    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Knob onChange={onChange} min={min} max={max} defaultValue={defaultValue}></Knob>
            {/*{marks ?*/}
            {/*    <Slider onChange={e => onChange(e.target.value)} valueLabelDisplay="auto" defaultValue={defaultValue}*/}
            {/*            min={min} max={max} step={1}*/}
            {/*            marks={marks}/>*/}
            {/*    : <Slider onChange={e => onChange(e.target.value)} valueLabelDisplay="auto" defaultValue={defaultValue}*/}
            {/*              min={min} max={max} step={1}*/}
            {/*              marks/>}*/}
        </FormControl>)
}