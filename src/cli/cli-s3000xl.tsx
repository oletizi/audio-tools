import React, {useState} from 'react';
import {render, Box, Text, useApp, useInput, useStdout} from 'ink';
import {Select} from '@inkjs/ui'
import midi from "midi";
import {newDevice} from "@/midi/akai-s3000xl.js";

const midiInput = new midi.Input()
const midiOutput = new midi.Output()
const device = newDevice(midiInput, midiOutput)

function Button(props) {
    return (<Box borderStyle="single" paddingLeft={1} paddingRight={1}><Text>{props.children}</Text></Box>)
}

function StartScreen() {

    return (<Box>
        <Text>MIDI Input</Text>
        <MidiSelect midiHandle={midiInput}/>
    </Box>)
}

function MidiSelect({midiHandle}: {midiHandle: midi.Input | midi.Output}) {
    const options = []
    for (let i=0; i< midiHandle.getPortCount(); i++) {
        options.push({label: midiHandle.getPortName(i), value: i})
    }
    return(<Select options={options}/>)
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

render(<Thingy/>);
