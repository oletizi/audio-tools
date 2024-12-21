"use client"
import FormControl from "@mui/material/FormControl";
import {InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Midi} from "@/midi/midi";
import {useState} from "react";
import {newClientConfig} from "@/lib/config-client";
import {newClientCommon} from "@/lib/client-common";


export default function Page() {
    const [midiInitialized, setMidiInitialized] = useState(false)
    const [inputMenuItems, setInputMenuItems] = useState<>([<MenuItem key="None" value="">None</MenuItem>])
    const [selectedInput, setSelectedInput] = useState<string>("")
    const midi = new Midi()
    let cfg = newClientConfig()
    const clientCommon = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))

    if (!midiInitialized) {

        midi.start(() => {
            setMidiInitialized(true)
        }).then(() => midi.getInputs().then((d) => {
                clientCommon.fetchConfig().then(r => {
                    if (r.errors.length == 0) {
                        cfg = r.data
                        setSelectedInput(cfg.midiInput)
                    }
                })
                setInputMenuItems(d.map(i => <MenuItem key={i.id} value={i.name}>{i.name}</MenuItem>))
            })
        )
    }
    return (<div className="container mx-auto">
        <div className="flex flex-col gap-10">
            <h1>Roland JV-1080</h1>
            <div className="flex gap-10 h-full">
                <FormControl>
                    <InputLabel id="midi-input-select-label">MIDI Input</InputLabel>
                    <Select
                        labelId="midi-input-select-label"
                        id="midi-input-select"
                        value={selectedInput}
                        label="MIDI Input"
                        onChange={(e: SelectChangeEvent) => {
                            setSelectedInput(e.target.value)
                            cfg.midiInput = e.target.value
                            clientCommon.saveConfig(cfg).then()
                        }}>
                        {inputMenuItems}
                    </Select>
                </FormControl>
            </div>
        </div>
    </div>)
}
