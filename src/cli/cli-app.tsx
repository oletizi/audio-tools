import {ProcessOutput} from "@/lib/process-output.js";
import {Program, Sample} from "@/midi/devices/s3000xl.js";
import {ProgramScreen} from "@/cli/components/program-screen.js";
import {ProgramDetailScreen} from "@/cli/components/program-detail-screen.js";
import {SampleScreen} from "@/cli/components/sample-screen.js";
import {SampleDetailScreen} from "@/cli/components/sample-detail-screen.js";
import {ChopDetailScreen} from "@/cli/components/chop-detail-screen.js";
import React from "react";
import {Device} from "@/midi/akai-s3000xl.js";

export interface CliApp {
    out: ProcessOutput

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
}

export interface Defaults {
    beatsPerChop: number
    bpm: number
}

export class BasicApp implements CliApp {
    private readonly listeners: Function[] = []
    private readonly defaults: Defaults = {beatsPerChop: 1, bpm: 90}
    private isEditing: boolean;

    readonly out: ProcessOutput
    private device: Device;

    constructor(device: Device, out: ProcessOutput) {
        this.device = device
        this.out = out
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
        this.device.getSample(sampleName).then(sample => this.setScreen(<SampleDetailScreen app={app} sample={sample}/>))
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

}