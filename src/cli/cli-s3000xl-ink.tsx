import React, {useState} from 'react';
import {render, Box, Text, useApp, useFocus, useInput, useStdout} from 'ink';
import {Select} from '@inkjs/ui'
import midi from "midi";
import {newDevice} from "@/midi/akai-s3000xl.js";
import {loadClientConfig, saveClientConfig} from "@/lib/config-server.js";

const midiInput = new midi.Input()
const midiOutput = new midi.Output()
const device = newDevice(midiInput, midiOutput)
const config = await loadClientConfig()

await updateMidiInput(config.midiInput)
await updateMidiOutput(config.midiOutput)


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
    for (let i = 0; i < midiHandle.getPortCount(); i++) {
        const portName = midiHandle.getPortName(i)
        if (portName === name) {
            midiHandle.closePort()
            midiHandle.openPort(i)
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

function App() {
    const {exit} = useApp();
    const {stdout} = useStdout()
    const [screen, setScreen] = useState(<StartScreen/>)

    function quit() {
        shutdown()
        exit()
    }

    function doMidi() {
        setScreen(<StartScreen/>)
    }

    useInput((input: string, key) => {
        switch (input.toUpperCase()) {
            case 'Q':
                quit()
                break
            case 'M':
                doMidi()
                break
        }
    })
    return (
        <>
            <Box borderStyle='single' padding='1' height={stdout.rows - 4}>{screen}</Box>
            <Box>
                <Button onClick={doMidi}>M: MIDI</Button>
                <Button onClick={quit}>Q: Quit</Button>
            </Box>
        </>
    )
}

render(<App/>);
