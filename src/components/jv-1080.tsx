import FormControl from "@mui/material/FormControl";
import {InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {useState} from "react";

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
        <FormControl fullWidth>
            <InputLabel>Fx Select</InputLabel>
            <Select label="Fx Select" value={value} onChange={(e : SelectChangeEvent<string>) => {
                const v = Number.parseInt(e.target.value)
                setValue(e.target.value)
                onSubmit(v)
            }}>
                {FX_TYPES.map((v, i) => (<MenuItem key={'fx-select-' + i} value={i}>{v}</MenuItem>))}
            </Select>
        </FormControl>)
}