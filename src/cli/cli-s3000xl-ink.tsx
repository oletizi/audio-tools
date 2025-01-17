import React, {useState} from 'react';
import {render, Box, Text, useApp, useFocus, useInput, useStdout} from 'ink';
import {Select} from '@inkjs/ui'
import midi from "midi";
import {newDevice} from "@/midi/akai-s3000xl.js";
import {loadClientConfig} from "@/lib/config-server.js";

const midiInput = new midi.Input()
const midiOutput = new midi.Output()
const device = newDevice(midiInput, midiOutput)
const config = await loadClientConfig()


function Button(props) {
    return (<Box borderStyle="single" paddingLeft={1} paddingRight={1}><Text>{props.children}</Text></Box>)
}

function StartScreen() {
    const [midiInputValue, setMidiInputValue] = useState(null)
    const [midiOutputValue, setMidiOutputValue] = useState(null)
    return (
        <Box flexDirection="column" gap={1} width="100%">
            <Box width="100%" justifyContent="space-around">
                <MidiSelect label="MIDI Input" defaultValue={config.midiInput} midiHandle={midiInput} onChange={(v) => setMidiInputValue(v)}/>
                <MidiSelect label="MIDI Output" defaultValue={config.midiOutput} midiHandle={midiOutput} onChange={(v) => setMidiOutputValue(v)}/>
            </Box>
            <Box gap={2}>
                <Text>Selected input: {midiInputValue}</Text>
                <Text>Selected output: {midiOutputValue}</Text>
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

function Thingy() {
    const {exit} = useApp();
    const {stdout} = useStdout()
    const [screen, setScreen] = useState(<StartScreen/>)
    const [msg, setMessage] = useState('Display here?')
    useInput((input: string, key) => {
        if (input.toUpperCase() === 'Q') {
            setMessage('You quit')
            exit()
        } else if (input.toUpperCase() === 'M') {
            setMessage('Do MIDI!')
        } else {
            setMessage(input)
        }
    })
    return (
        <>
            <Box borderStyle='single' padding='1' height={stdout.rows - 4}>{screen}</Box>
            <Box>
                <Button>M: MIDI</Button>
                <Button>Q: Quit</Button>
            </Box>
        </>
    )
}

render(<StartScreen/>);
