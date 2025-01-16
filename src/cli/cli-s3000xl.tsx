import React, {useState, useEffect} from 'react';
import {render, Box, Text, useInput} from 'ink';

function Thingy() {
    const [msg, setMessage] = useState('Display here?')
    useInput((input, key) => {
        setMessage(msg + input)
    })
    return (
        <>
            <Box borderStyle='single' padding='1'>
                <Text>{msg}</Text>
            </Box>
            <Box paddingLeft={2} paddingRight={2}><Text>Commands here?</Text></Box>
        </>
    )
}

render(<Thingy/>);
