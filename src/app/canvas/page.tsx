"use client"
import {Knob} from "@/components/knob";
import {useState} from "react";

export default function Page() {
    const [value, setValue] = useState(0)
    return <div className="container">
        <Knob color="#666" backgroundColor="#aaa" strokeWidth={3} onChange={(v) => setValue(v)} min={0} max={127}/>
        <div>{Math.round(value)}</div>
    </div>
}

