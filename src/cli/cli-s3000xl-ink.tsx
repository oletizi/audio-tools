import React, {useState} from 'react';
import {render, Box, Text, useApp, useFocus, useInput, useStdout} from 'ink';
import {Select} from '@inkjs/ui'
import midi from "midi";
import {newDevice} from "@/midi/akai-s3000xl.js";
import {loadClientConfig, newServerConfig, saveClientConfig} from "@/lib/config-server.js";
import {newStreamOutput} from "@/lib/process-output.js";
import fs from "fs";
import {maxHeaderSize} from "http";

const serverConfig = await newServerConfig()
const logstream = fs.createWriteStream(serverConfig.logfile)
const out = newStreamOutput(logstream, logstream, true, 'cli-s3000xl')
const config = await loadClientConfig()

const midiInput = new midi.Input()
midiInput.ignoreTypes(false, false, false)
const midiOutput = new midi.Output()


out.log(`startup`)
await updateMidiInput(config.midiInput)
await updateMidiOutput(config.midiOutput)
const device = newDevice(midiInput, midiOutput, out)
await device.init()

async function updateMidiInput(v: string) {
    if (openMidiPort(midiInput, v)) {
        config.midiInput = v
        await saveClientConfig(config)
    }
}

async function updateMidiOutput(v: string) {
    if (openMidiPort(midiOutput, v)) {
        config.midiOutput = v
        await saveClientConfig(config)
    }
}

function openMidiPort(midiHandle: midi.Input | midi.Output, name: string) {
    out.log(`Opening midi port: ${name}`)
    for (let i = 0; i < midiHandle.getPortCount(); i++) {
        const portName = midiHandle.getPortName(i)
        if (portName === name) {
            out.log(`Closing midi port: ${name}`)
            midiHandle.closePort()
            out.log(`Opening midi port: ${name}`)
            midiHandle.openPort(i)
            out.log(`Midi port open: ${name}`)
            return true
        }
    }
    return false
}

function shutdown() {
    [midiInput, midiOutput].forEach(i => i.closePort())
}

function Button(props) {
    const {isFocused} = useFocus()
    useInput((input, key) => {
        if (props.onClick && isFocused && key.return) {
            props.onClick()
        }
    })
    return (<Box borderStyle="single" paddingLeft={1}
                 paddingRight={1}><Text inverse={isFocused}>{props.children}</Text></Box>)
}


function MidiSelect({defaultValue, midiHandle, label, onChange}: {
    defaultValue: string,
    midiHandle: midi.Input | midi.Output,
    label: string,
    onChange: (string) => void
}) {
    const {isFocused} = useFocus();
    const options = []
    for (let i = 0; i < midiHandle.getPortCount(); i++) {
        options.push({label: midiHandle.getPortName(i), value: midiHandle.getPortName(i)})
    }
    return (<Box gap={2}>
        <Text>{label + (isFocused ? ` (focused)` : ` (blurred)`)}</Text>
        <Select defaultValue={defaultValue} isDisabled={!isFocused} onChange={onChange} options={options}/>
    </Box>)
}

function StartScreen() {
    return (
        <Box flexDirection="column" gap={1} width="100%">
            <Box width="100%" justifyContent="space-around">
                <MidiSelect label="MIDI Input" defaultValue={config.midiInput} midiHandle={midiInput}
                            onChange={(v) => updateMidiInput(v)}/>
                <MidiSelect label="MIDI Output" defaultValue={config.midiOutput} midiHandle={midiOutput}
                            onChange={(v) => updateMidiOutput(v)}/>
            </Box>
        </Box>)
}


function ProgramDetailScreen({programName}: { programName: string }) {
    const header = device.getProgramHeader(programName)
    const fields = []
    let maxLabel = 0
    for (const prop of Object.getOwnPropertyNames(header)) {
        out.log(`prop: ${prop}`)
        const labelField = prop + 'Label'
        if (header[labelField]) {
            const label = header[labelField]
            const value = header[prop]
            maxLabel = label.length > maxLabel ? label.length : maxLabel
            fields.push({Name: label, Value: value})
        }
    }

    out.log(`Max label: ${maxLabel}`)

    return (
        <Box justifyContent="flex-start" flexDirection="column" width={32}>
            {fields.map(f => {
                return (<Box justifyContent="space-between"><Text>{f.Name}</Text><Text>{f.Value}</Text></Box>)
            })}
        </Box>)
}

function ProgramScreen({names, setScreen}: { names: string[], setScreen: (any) => void }) {
    const options = names.map((programName) => {
        return {label: programName, value: programName}
    })
    return (
        <Box>
            <Select options={options} onChange={(v) => setScreen(<ProgramDetailScreen programName={v}/>)}/>
        </Box>
    )
}

function App() {
    const {exit} = useApp();
    const [screen, setScreen] = useState(<StartScreen/>)
    const {stdout} = useStdout()

    function quit() {
        shutdown()
        exit()
    }

    function doMidi() {
        setScreen(<StartScreen/>)
    }

    function doProgram() {
        setScreen(<ProgramScreen names={device.getProgramNames([])} setScreen={setScreen}/>)
    }

    useInput((input: string, key) => {
        switch (input.toUpperCase()) {
            case 'M':
                doMidi()
                break
            case 'P':
                doProgram()
                break
            case 'Q':
                quit()
                break
        }
    })
    return (
        <>
            <Box borderStyle='single' padding='1' height={stdout.rows - 4}>{screen}</Box>
            <Box>
                <Button onClick={doProgram}>P: Program</Button>
                <Button onClick={doMidi}>M: MIDI</Button>
                <Button onClick={quit}>Q: Quit</Button>
            </Box>
        </>
    )
}

render(<App/>);
