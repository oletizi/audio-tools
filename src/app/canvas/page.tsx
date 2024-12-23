"use client"
import {Knob} from "@/components/knob";
import {useState} from "react";
import {Stack} from "@mui/material";

export default function Page() {
    const mainColor = "#aaaaaa"
    const knobColor="#ffffff"
    const [value, setValue] = useState(100)
    return <div className="container pt-10">
        <Stack className="flex flex-col items-center">
            <Knob color={knobColor} backgroundColor={mainColor} strokeWidth={3} onChange={(v) => setValue(v)} min={0} max={127} defaultValue={value}/>
            <div style={{color: mainColor}}>{Math.round(value)}</div>
        </Stack>
    </div>
}

