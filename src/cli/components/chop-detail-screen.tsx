import {Sample} from "@/midi/devices/s3000xl.js";
import React, {useState} from "react";
import {Box, Text} from "ink"
import {DataDisplay, DataField} from "@/cli/components/data-field.js";
import {CliApp} from "@/cli/cli-app.js";

export function ChopDetailScreen({app, sample}: { app: CliApp, sample: Sample }) {
    const [bpm, setBpm] = useState(app.getDefaults().bpm)
    const [beatsPerChop, setBeatsPerChop] = useState(app.getDefaults().beatsPerChop)
    let defaults = app.getDefaults()

    function getSamplesPerBeat() {
        return Math.round(sample.getSampleRate() / (bpm / 60))
    }

    function getTotalChops() {
        return Math.round(sample.getSampleLength() / (getSamplesPerBeat() * beatsPerChop))
    }

    return (
        <Box justifyContent="flex-start" flexDirection="column" width={32}>
            <Text>Chop Detail</Text>
            <DataField app={app}
                       label={`Sample Name`}
                       defaultValue={sample.getSampleName().trim()}
                       onChange={(v) => {
                           sample.setSampleName(String(v))
                           app.saveSample(sample).then()
                           return sample.getSampleName()
                       }}/>
            <DataDisplay label="Sample Rate" value={sample.getSampleRate()}/>
            <DataDisplay label="Sample Length" value={sample.getSampleLength()}/>
            <DataField app={app}
                       label="BPM"
                       defaultValue={String(bpm)}
                       onChange={(v) => {
                           const parsed = parseInt(String(v).trim())
                           setBpm(parsed)
                           defaults.bpm = bpm
                           app.saveDefaults(defaults).then(d => defaults = d)
                           return v
                       }}/>
            <DataField app={app}
                       label="Beats per Chop"
                       defaultValue={String(beatsPerChop)}
                       onChange={(v) => {
                           setBeatsPerChop(parseInt(String(v).trim()))
                           defaults.beatsPerChop = beatsPerChop
                           app.saveDefaults(defaults).then(d => defaults = d)
                           return v
                       }}/>
            <DataDisplay label="Samples per Beat" value={String(getSamplesPerBeat())}/>
            <DataDisplay label="Total Chops" value={String(getTotalChops())}/>
        </Box>)
}