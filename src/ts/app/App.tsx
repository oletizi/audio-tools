import {createRoot} from "react-dom/client"
import React from 'react'
import '@shoelace-style/shoelace/dist/themes/light.css'
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/')
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js'
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js"

function MyButton() {
    return (
        <button className={'btn btn-primary'}>I'm a button</button>
    )
}

function MyShoelaceButton() {
    return (<SlButton variant={'primary'} onClick={() => {console.log(`You Clicked me!`)}}>Shoelace!</SlButton>)
}

function MyRangeSlider() {
    return (<SlRange
        label={'Loudness'}
        min={0}
        max={100}
        value={85}></SlRange>)
}

export default function App() {
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton/>
            <MyShoelaceButton/>
            <MyRangeSlider/>
        </div>
    )
}

createRoot(document.getElementById("app")).render(<App/>)