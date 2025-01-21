import React, {useState} from 'react';
import {Box, render, useApp, useInput, useStdout} from 'ink';

import midi from "midi";
import {newDevice} from "@/midi/akai-s3000xl.js";
import {loadClientConfig, newServerConfig, saveClientConfig} from "@/lib/config-server.js";
import {newStreamOutput, ProcessOutput} from "@/lib/process-output.js";
import fs from "fs";
import {Program} from "@/midi/devices/s3000xl.js";
import {ProgramScreen} from "@/cli/components/program-screen.js";
import {StartScreen} from "@/cli/components/start-screen.js";
import {Button} from "@/cli/components/button.js";
import {ProgramDetailScreen} from "@/cli/components/program-detail-screen.js";
import e from "express";
import {SampleScreen} from "@/cli/components/sample-screen.js";
import {SampleDetailScreen} from "@/cli/components/sample-detail-screen.js";

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

out.log(`Initializing device...`)
await device.init()
out.log(`Done initializing device.`)
let currentProgram = device.getCurrentProgram()
out.log(`Current program: ${currentProgram.getProgramName()}`)
out.log(`Rendering app...`)


export interface CliApp {
    out: ProcessOutput

    setScreen(screen): void

    save(program: Program): Promise<void>;

    doProgramDetail(programNumber: number): void;

    addListener(event: string, callback: Function): void;

    setIsEditing(b: boolean): void

    getIsEditing(): boolean

    doSampleDetail(sampleName): void
}

class BasicApp implements CliApp {
    private readonly listeners: Function[] = []
    out: ProcessOutput = out
    setScreen: (Element) => void = (element) => {
        this.listeners.forEach(callback => callback(element))
    }
    private isEditing: boolean;

    addListener(event: string, callback: Function) {
        this.listeners.push(callback)
    }

    async save(p: Program) {
        try {
            await p.save()
            out.log(`Program saved.`)
        } catch (e) {
            out.log(`Error saving program: ${e}`)
        }
    }

    doProgramDetail(programNumber: number): void {
        const app = this
        device.getProgram(programNumber).then(program => this.setScreen(<ProgramDetailScreen app={app}
                                                                                             program={program}/>))
    }

    doSampleDetail(sampleName): void {
        const app = this
        device.getSample(sampleName).then(sample => this.setScreen(<SampleDetailScreen app={app} sample={sample}/>))
    }

    setIsEditing(b: boolean): void {
        this.isEditing = b
    }

    getIsEditing() {
        return this.isEditing
    }
}


export function Main({app, program}: { app: CliApp, program: Program }) {
    const {exit} = useApp();
    const [screen, setScreen] = useState(<ProgramDetailScreen app={app} program={program}/>)
    const {stdout} = useStdout()

    app.addListener('screen', (s) => {
        setScreen(s)
    })

    function quit() {
        shutdown(exit)
    }

    function doMidi() {
        setScreen(<StartScreen defaultMidiInput={config.midiInput}
                               defaultMidiOutput={config.midiOutput}
                               midiInput={midiInput}
                               midiOutput={midiOutput}
                               updateMidiInput={updateMidiInput}
                               updateMidiOutput={updateMidiOutput}
        />)
    }

    function doSample() {
        setScreen(<SampleScreen app={app} device={device} names={device.getSampleNames([])} setScreen={setScreen}/>)
    }

    function doProgram() {
        setScreen(<ProgramScreen app={app} device={device} names={device.getProgramNames([])} setScreen={setScreen}/>)
    }

    useInput((input: string, key) => {
        if (!app.getIsEditing()) {
            switch (input.toUpperCase()) {
                case 'M':
                    doMidi()
                    break
                case 'S':
                    doSample()
                    break
                case 'P':
                    doProgram()
                    break
                case 'Q':
                    quit()
                    break
            }
        }
    })
    return (
        <>
            <Box borderStyle='single' padding='1' height={stdout.rows - 4}>{screen}</Box>
            <Box>
                <Button onClick={doProgram}>P: Program</Button>
                <Button onClick={doSample}>S: Sample</Button>
                <Button onClick={doMidi}>M: MIDI</Button>
                <Button onClick={quit}>Q: Quit</Button>
            </Box>
        </>
    )
}

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

function shutdown(cb = () => {
}) {
    [midiInput, midiOutput].forEach(i => i.closePort())
    cb()
}


try {
    render(<Main
        app={new BasicApp()}
        program={currentProgram}/>)
} catch (e) {
    out.log(`Error rendering Main: ${e}`)
    shutdown()
}



