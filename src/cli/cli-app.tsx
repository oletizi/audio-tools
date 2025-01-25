import midi from "midi";
import {ProcessOutput} from "@/lib/process-output.js";
import {Program, Sample} from "@/midi/devices/s3000xl.js";
import {ProgramScreen} from "@/cli/components/program-screen.js";
import {ProgramDetailScreen} from "@/cli/components/program-detail-screen.js";
import {SampleScreen} from "@/cli/components/sample-screen.js";
import {SampleDetailScreen} from "@/cli/components/sample-detail-screen.js";
import {ChopDetailScreen} from "@/cli/components/chop-detail-screen.js";
import React from "react";
import {Device} from "@/midi/akai-s3000xl.js";
import {StartScreen} from "@/cli/components/start-screen.js";
import {ClientConfig} from "@/lib/config-client.js";
import {saveClientConfig} from "@/lib/config-server.js";

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


export function updateMidiInput(config: ClientConfig, midiInput: midi.Input, v: string) {
    if (openMidiPort(midiInput, v)) {
        config.midiInput = v
        saveClientConfig(config).then()
    }
}

export function updateMidiOutput(config: ClientConfig, midiOutput: midi.Output, v: string) {
    if (openMidiPort(midiOutput, v)) {
        config.midiOutput = v
        saveClientConfig(config).then()
    }
}


export interface CliApp {
    out: ProcessOutput

    doConfig()

    getDefaults(): Defaults

    saveDefaults(d: Defaults): Promise<Defaults>

    addListener(event: string, callback: Function): void

    setScreen(screen): void

    setIsEditing(b: boolean): void

    getIsEditing(): boolean

    doProgram(): void

    doProgramDetail(programNumber: number): void;

    saveProgram(program: Program): Promise<void>;

    doSample(): void

    doSampleDetail(sampleName): void

    doChop(): void;

    doChopDetail(sampleName): void;

    saveSample(sample: Sample): Promise<void>;

    chopSample(sample: Sample, chopLength: number, totalChops: number): Promise<void>
}

export interface Defaults {
    beatsPerChop: number
    bpm: number
}


class BasicApp implements CliApp {
    private readonly listeners: Function[] = []
    private readonly defaults: Defaults = {beatsPerChop: 1, bpm: 90}
    private readonly device: Device;
    protected readonly config: ClientConfig;

    private isEditing: boolean;

    readonly out: ProcessOutput


    constructor(config: ClientConfig, device: Device, out: ProcessOutput) {
        this.config = config
        this.device = device
        this.out = out
    }

    async chopSample(sample: Sample, chopLength: number, totalChops: number): Promise<void> {
        await this.device.chopSample(sample, chopLength, totalChops)
    }

    setIsEditing(b: boolean): void {
        this.isEditing = b
    }

    getIsEditing() {
        return this.isEditing
    }

    getDefaults(): Defaults {
        return this.defaults
    }

    async saveDefaults(d: Defaults): Promise<Defaults> {
        return this.defaults
    }


    setScreen: (Element) => void = (element) => {
        this.listeners.forEach(callback => callback(element))
    }

    addListener(event: string, callback: Function) {
        this.listeners.push(callback)
    }

    async saveProgram(p: Program) {
        const out = this.out
        try {
            await p.save()
            out.log(`Program saved.`)
        } catch (e) {
            out.log(`Error saving program: ${e}`)
        }
    }

    async saveSample(s: Sample) {
        const out = this.out
        try {
            await s.save()
            out.log(`Sample saved.`)
        } catch (e) {
            out.log(`Error saving sample: ${s}`)
        }
    }

    doProgram() {
        const device = this.device
        const app = this
        this.setScreen(<ProgramScreen nextScreen={(v) => {
            app.doProgramDetail(v)
        }} names={device.getProgramNames([])}/>)
    }

    doProgramDetail(programNumber: number): void {
        const app = this
        this.device.getProgram(programNumber).then(program => this.setScreen(<ProgramDetailScreen app={app}
                                                                                                  program={program}/>))
    }

    doSample() {
        const app = this
        const device = this.device
        this.setScreen(<SampleScreen nextScreen={(v) => {
            app.doSampleDetail(v)
        }} names={device.getSampleNames([])}/>)
    }

    doSampleDetail(sampleName): void {
        const app = this
        this.device.getSample(sampleName).then(sample => this.setScreen(<SampleDetailScreen app={app}
                                                                                            sample={sample}/>))
    }

    doChop() {
        const device = this.device
        const app = this
        this.setScreen(<SampleScreen nextScreen={(v) => {
            app.doChopDetail(v)
        }} names={device.getSampleNames([])}/>)
    }

    doChopDetail(sampleName): void {
        const app = this
        this.device.getSample(sampleName).then(sample => this.setScreen(<ChopDetailScreen app={app} sample={sample}/>))
    }

    doConfig() {
    }
}

export function newFileApp(config: ClientConfig, device: Device, out: ProcessOutput, diskFilePath: string) {
    return new FileApp(config, device, out, diskFilePath)
}

class FileApp extends BasicApp {
    private diskFilePath: string
    constructor(config: ClientConfig, device: Device, out: ProcessOutput, diskFilePath: string) {
        super(config, device, out)
        this.diskFilePath = diskFilePath
    }
}

export function newMidiApp(config: ClientConfig, device: Device, out: ProcessOutput, midiInput: midi.Input, midiOutput: midi.Output) {
    return new MidiApp(config, device, out, midiInput, midiOutput)
}

class MidiApp extends BasicApp {
    private readonly midiInput: midi.Input
    private readonly midiOutput: midi.Output

    constructor(config: ClientConfig, device: Device, out: ProcessOutput, midiInput: midi.Input, midiOutput: midi.Output) {
        super(config, device, out)
        this.midiInput = midiInput
        this.midiOutput = midiOutput
    }

    doConfig() {
        const config = super.config
        const midiInput = this.midiInput
        const midiOutput = this.midiOutput


        this.setScreen(<StartScreen defaultMidiInput={config.midiInput}
                                    defaultMidiOutput={config.midiOutput}
                                    midiInput={midiInput}
                                    midiOutput={midiOutput}
                                    updateMidiInput={(v) => updateMidiInput(config, midiInput, v)}
                                    updateMidiOutput={(v) => updateMidiOutput(config, midiOutput, v)}
        />)
    }
}
