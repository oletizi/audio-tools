import React, {useState} from 'react';
import {render, Box, Text, useApp, useInput, useStdout} from 'ink';



function Button(props) {
    return (<Box borderStyle="single" paddingLeft={1} paddingRight={1}><Text>{props.children}</Text></Box>)
}

function StartScreen() {
    return (<Text>Hello!</Text>)
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
