"use client"
import {Knob} from "@/components/knob";
import {useState} from "react";
import {Stack} from "@mui/material";

import {DoubleThrowSwitch} from "@/components/components-core";

export default function Page() {
    const mainColor = "#aaaaaa"
    const [value, setValue] = useState(1)
    return <div className="container pt-10">
        <Stack className="flex flex-col items-center">
            <Knob strokeWidth={3}
                  onChange={(v) => {
                      console.log(`new value: ${v}`)
                      setValue(v)
                  }}
                  min={0}
                  max={5}
                  step={1}
                  defaultValue={value}/>
            <div style={{color: mainColor}}>{value}</div>
        </Stack>
        <DoubleThrowSwitch aLabel="A Label" bLabel="B Label" onChange={(v) => console.log(`Double throw switch value: ${v}`)}/>
    </div>
}

