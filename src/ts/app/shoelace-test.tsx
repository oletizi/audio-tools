import {createRoot} from "react-dom/client"
import React, {useState} from 'react'
import Button from 'react-bootstrap/Button';

import '@shoelace-style/shoelace/dist/themes/light.css'
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'

setBasePath('https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.18.0/cdn/')
import SlButton from '@shoelace-style/shoelace/dist/react/button/index.js'
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js"
import SlSelect from "@shoelace-style/shoelace/dist/react/select/index.js";
import {Col, Container, Row} from "react-bootstrap";
import SlOption from "@shoelace-style/shoelace/dist/react/option/index.js";

function MyButton() {
    return (
        <button className={'btn btn-primary'}>I'm a button</button>
    )
}

function MyShoelaceButton() {
    return (<SlButton variant={'primary'} onClick={() => {
        console.log(`You Clicked me!`)
    }}>Shoelace!</SlButton>)
}

function MyReactBootstrapButton() {
    return (<Button>React-bootstrap</Button>)
}

function MyRangeSlider() {
    const initial = 85
    const [val, setVal] = useState(initial)
    return (<SlRange
        onSlChange={(event) => {
            const updated = (event.target as any).value
            console.log(`Change!!! Event: ${updated}`)
            setVal(updated)
        }}
        onSlInput={(event) => setVal((event.target as any).value)}
        label={val.toString()}
        min={0}
        max={100}
        value={val}></SlRange>)
}

function MySelect({name}) {
    return (
        <SlSelect
            name={name}
            value={'b'}
            onSlShow={(event) => console.log(`SlSelect: SlShow!!!!`)}
            onSlChange={(event) => console.log('SlSelect: SlChange!!!!')}
            onSlInput={(event) => console.log('SlSelect: SlInput!!!!')}>
            <SlOption key={'a'} value={'a'}>Option A</SlOption>
            <SlOption key={'b'} value={'b'}>Option B</SlOption>
        </SlSelect>
    )
}

export default function ShoelaceTest() {
    return (
        <Container>
            <Row>
                <Col lg={6}>
                    <h1>React and Shoelace Tests</h1>
                    <MyButton/>
                    <MyShoelaceButton/>
                    <MyReactBootstrapButton/>
                    <MyRangeSlider/>
                    <MySelect name={'my-select-name'}/>
                </Col>
            </Row>
        </Container>
    )
}

createRoot(document.getElementById("app")).render(<ShoelaceTest/>)