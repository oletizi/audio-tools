import FormControl from "@mui/material/FormControl";
import {
    Box,
    FormLabel,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Slider,
    Stack, Switch,
    Typography
} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {Jv1080} from "@/midi/roland";
import {Mark} from "@mui/material/Slider/useSlider.types";
import {Knob} from "@/components/knob";
import Divider from "@mui/material/Divider";

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

// TODO: Refactor these to a general component file
export function DoubleThrowSwitch({color = "#777", aLabel, bLabel, onChange = () => void 0}: {
    color?: string, aLabel: string, bLabel: string, onChange?: (v: number) => void
}) {
    return (
        <div className="flex justify-center content-center items-center" style={{color: color}}>
            <div>{aLabel}</div>
            <Switch onChange={(e) => {
                onChange(e.target.checked ? 1 : 0)
            }}/>
            <div>{bLabel}</div>
        </div>)
}

function LabeledBorder({border = 2, borderRadius = 1, label = "", textColor = "#999", color = "#ddd", children}) {
    return (
        <Box
            border={border}
            borderColor={color}
            borderRadius={borderRadius}
            p={2}
            position="relative"
        >
            <Box
                position="absolute"
                top={-14}
                left={10}
                bgcolor="white"
                px={1}
            >
                <span style={{color: textColor}}>{label}</span>
            </Box>
            {children}
        </Box>
    )
}

export function StereoEqPanel({device, color = "#777"}: { device: Jv1080, color?: string }) {
    const stackGap = 2
    return (
        <div className="flex gap-10">
            <ControlSection label="Hi & Lo Shelf">
                <Stack spacing={stackGap}>

                    {/*FX Param 3*/}
                    <ControlKnob color={color} label="Hi Gain" min={-15} max={15}
                                 onChange={v => device.setFxParam(3, v + 15)}/>
                    {/* FX Param 2*/}
                    <DoubleThrowSwitch aLabel="4KHz" bLabel="8KHz"
                                       onChange={(v) => device.setFxParam(2, v)}/>
                    <Divider/>
                    <ControlKnob label="Lo Gain" min={-15} max={15} step={1}
                                 onChange={v => device.setFxParam(1, v + 15)}/>
                    <DoubleThrowSwitch aLabel="200Hz" bLabel="400Hz"
                                       onChange={(v) => device.setFxParam(0, v)}/>
                </Stack>
            </ControlSection>
            <ControlSection label="Lo Mid">
                <Stack spacing={stackGap}>
                    <ControlKnob label="Gain" min={-15} max={15}
                                 onChange={v => device.setFxParam(6, v + 15)}/>
                    <ControlKnob label="Q" min={0} max={4}
                                 marks={[
                                     {label: '0.5', value: 0},
                                     {label: '1.0', value: 1},
                                     {label: '2.0', value: 2},
                                     {label: '4.0', value: 3},
                                     {label: '9.0', value: 4}
                                 ]}
                                 onChange={v => device.setFxParam(5, v)}/>
                    <ControlKnob label="Freq" min={0} max={15}
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
                </Stack>
            </ControlSection>

        </div>)
}

function ControlSection({label = "", children}) {
    // return (<div className="border-2 p-10 rounded">{children}</div>)
    return (<LabeledBorder label={label}>{children}</LabeledBorder>)
}

function ControlKnob({onChange, label, min, max, defaultValue = 0, step = 1, marks = [], color = "#777777"}: {
    onChange: (v: number) => void,
    label: string,
    min: number,
    max: number,
    defaultValue?: number,
    step?: number,
    marks?: { label: string | number, value: number }[],
    color?: string
}) {
    const [value, setValue] = useState(defaultValue)
    const mark = marks.filter(i => i.value === value)
    return (
        <FormControl>
            <div className="flex flex-col items-center">
                <FormLabel>{label}</FormLabel>
                <Knob
                    backgroundColor={color}
                    onChange={(v) => {
                        onChange(v)
                        setValue(v)
                    }}
                    min={min}
                    max={max}
                    defaultValue={defaultValue}
                    step={step}></Knob>
                <Typography sx={{color: color}}>{mark.length > 0 ? mark[0].label : value}</Typography>
            </div>
        </FormControl>)
}