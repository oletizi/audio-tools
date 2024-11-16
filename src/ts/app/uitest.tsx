// core styles are required for all packages
import '@mantine/core/styles.css';
import { DEFAULT_THEME } from '@mantine/core';
import {createRoot} from "react-dom/client";
import * as React from "react"
import {createTheme, MantineProvider} from '@mantine/core'
import {Select} from '@mantine/core'

const theme = createTheme({
    /** Put your mantine theme override here */
})

const appRoot = createRoot(document.getElementById('app'))
appRoot.render(
    <div className={'container'}>
        <MantineProvider theme={theme}>
            <Select
                label="Your favorite library"
                placeholder="Pick value"
                data={['React', 'Angular', 'Vue', 'Svelte']}/>
        </MantineProvider>
    </div>
)