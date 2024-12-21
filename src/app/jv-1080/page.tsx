"use client"
import FormControl from "@mui/material/FormControl";
import {InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {Midi} from "@/midi/midi";
import {useState} from "react";
import {ClientConfig, newClientConfig} from "@/lib/config-client";
import {newClientCommon} from "@/lib/client-common";


export default function Page() {
    const [midiInitialized, setMidiInitialized] = useState(false)
    const [inputMenuItems, setInputMenuItems] = useState([<MenuItem key="None" value="">None</MenuItem>])
    const [outputMenuItems, setOutputMenuItems] = useState([<MenuItem key="None" value="">None</MenuItem>])
    const [selectedInput, setSelectedInput] = useState<string>("")
    const [selectedOutput, setSelectedOutput] = useState<string>("")
    const [clientConfig, setClientConfig] = useState<ClientConfig>(newClientConfig())
    const midi = new Midi()
    const clientCommon = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))

    if (!midiInitialized) {
        midi.start(() => {
            setMidiInitialized(true)
        }).then(() => {

                clientCommon.fetchConfig().then(r => {
                        if (r.errors.length == 0) {
                            const cfg = r.data
                            setClientConfig(cfg)
                            setSelectedInput(cfg.midiInput)
                            setSelectedOutput(cfg.midiOutput)
                            midi.setInputByName(cfg.midiInput).then()
                            midi.setOutputByName(cfg.midiOutput).then()
                        }
                    }
                )
                midi.getInputs().then((d) => {
                    setInputMenuItems(d.map(i => <MenuItem key={i.id} value={i.name}>{i.name}</MenuItem>))
                })
                midi.getOutputs().then((d) => {
                    setOutputMenuItems(d.map(i => <MenuItem key={i.id} value={i.name}>{i.name}</MenuItem>))
                })
            }
        )
    }
    return (<div className="container mx-auto">
        <div className="flex flex-col gap-10">
            <h1>Roland JV-1080</h1>
            <div className="flex gap-10">
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
                                clientConfig.midiInput = e.target.value
                                clientCommon.saveConfig(clientConfig).then()
                                setClientConfig(clientConfig)
                                midi.setInputByName(clientConfig.midiInput).then()
                            }}>
                            {inputMenuItems}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel id="midi-output-select-label">MIDI Output</InputLabel>
                        <Select
                            labelId="midi-output-select-label"
                            id="midi-output-select"
                            value={selectedOutput}
                            label="MIDI Output"
                            onChange={(e: SelectChangeEvent) => {
                                setSelectedOutput(e.target.value)
                                clientConfig.midiOutput = e.target.value
                                console.log(`Saving config...`)
                                console.log(clientConfig)
                                clientCommon.saveConfig(clientConfig).then()
                                setClientConfig(clientConfig)
                                midi.setOutputByName(clientConfig.midiOutput).then()
                            }}>
                            {outputMenuItems}
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    </div>)
}
