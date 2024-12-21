"use client"
import FormControl from "@mui/material/FormControl";
import {InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Midi} from "@/midi/midi";
import {useState} from "react";
import {Input} from "webmidi";


export default function Page() {
    const [midiInitialized, setMidiInitialized] = useState(false)
    const [inputMenuItems, setInputMenuItems] = useState<>([<MenuItem key="None" value="">None</MenuItem>])
    const [selectedInput, setSelectedInput] = useState<string>("")
    const midi = new Midi()
    if (!midiInitialized) {
        midi.start(() => {
            console.log(`MIDI initialized.`)
            setMidiInitialized(true)
        }).then(() => midi.getInputs().then((d) => {
                if (d.length > 0) {
                    setSelectedInput(d[0].id)
                }
                setInputMenuItems(d.map(i => <MenuItem key={i.id} value={i.id}>{i.name}</MenuItem>))
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
                        onChange={(e: SelectChangeEvent) => setSelectedInput(e.target.value)}>
                        {inputMenuItems}
                    </Select>
                </FormControl>
            </div>
        </div>
    </div>)
}
