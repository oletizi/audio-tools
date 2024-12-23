import FormControl from "@mui/material/FormControl";
import {Box, FormLabel, InputLabel, MenuItem, Select, SelectChangeEvent, Slider, Stack} from "@mui/material";
import {useState} from "react";
import {Jv1080} from "@/midi/roland";


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
    const marks = [{value: 0, label: '200Hz'}, {value: 1, label: '400Hz'}]
    return (
        <Stack>
            <FormControl>
                <FormLabel>Low</FormLabel>
                <Slider onChange={(e) => device.setFxParam(0, e.target.value)} defaultValue={0} step={null} valueLabelDisplay="auto" marks={marks} min={0} max={1}/>
            </FormControl>
            <FormControl>
                <FormLabel>Boost/Cut</FormLabel>
                <Slider defaultValue={0} step={1} valueLabelDisplay="auto" min={-15} max={15}/>
            </FormControl>
        </Stack>)
}
