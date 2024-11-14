import {createRoot} from "react-dom/client"
import React from 'react'
import '@shoelace-style/shoelace/dist/themes/light.css'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/')
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js'
function MyButton() {
    return (
        <button className={'btn btn-primary'}>I'm a button</button>
    )
}

export default function App() {
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton />
            <SlButton variant={'primary'}>I'm a shoelace button</SlButton>
        </div>
    )
}

createRoot(document.getElementById("app")).render(<App/>)