import React, {useEffect, useState} from "react";
import {SampleMetadata} from "@/model/sample";
import {getMeta} from "@/lib/client-translator";
import {FieldDisplay} from "@/components/components-core";
import {Button, Slider, TextField} from "@mui/material";

export function ChopDetailScreen(
    {
        file,
        onErrors = (e) => console.error(e),
        doIt
    }: {
        file: string | null,
        onErrors: (e: Error | Error[]) => void,
        doIt: (prefix: string, samplesPerBeat: number, beatsPerChop: number) => void
    }) {
    const [meta, setMeta] = useState<SampleMetadata | null>(null)
    const [bpm, setBpm] = useState<number>(120)
    const [beatsPerChop, setBeatsPerChop] = useState<number>(4)
    const [prefix, setPrefix] = useState<string>('chop.01')
    useEffect(() => {
        if (file) {
            getMeta(file).then(r => {
                if (r.errors.length) {
                    onErrors(r.errors)
                } else {
                    setMeta(r.data)
                }
            })
        }

    }, [file])

    function getSamplesPerBeat() {
        return Math.round(meta?.sampleRate / (bpm / 60))
    }

    function getTotalChops() {
        return Math.round(meta?.sampleLength / (getSamplesPerBeat() * beatsPerChop))
    }

    function getTotalBeats() {
        return Math.round(meta?.sampleLength / getSamplesPerBeat())
    }

    return (
        <div className="flex flex-col gap-4">
            <div>Let's chop this sample! {file ? file : 'Choose a file!'}</div>
            <div><Metadata meta={meta}/></div>
            {meta ? (
                    <>
                        <FieldDisplay label="BPM" value={bpm}/>
                        <FieldDisplay label="Total Beats" value={getTotalBeats()}/>
                        <FieldDisplay label="Samples per Beat" value={getSamplesPerBeat()}/>
                        <FieldDisplay label="Beats per Chop" value={beatsPerChop}/>
                        <FieldDisplay label="Total Chops" value={getTotalChops()}/>
                        <div className="flex gap-4">
                            <div className="w-1/2">BPM:</div>
                            <div className="grow">
                                <Slider value={bpm} min={60} max={200} valueLabelDisplay="auto" step={1}
                                        shiftStep={5} onChange={e => setBpm(e.target.value)}/>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-1/2">Beats per Chop:</div>
                            <div className="grow">
                                <Slider value={beatsPerChop} min={1} max={32} marks valueLabelDisplay="auto" step={1}
                                        shiftStep={4} onChange={e => setBeatsPerChop(e.target.value)}/>
                            </div>
                        </div>
                        <TextField label="Prog. Name" value={prefix} onChange={e => setPrefix(e.target.value)}/>
                        <Button variant="contained" onClick={() => doIt(prefix, getSamplesPerBeat(), beatsPerChop)}>Do
                            It!</Button>
                    </>) :
                (<></>)
            }
        </div>
    )
}

function Metadata({meta}: { meta: SampleMetadata | null }) {
    if (!meta) {
        return (<></>)
    }
    return (
        <div className="flex flex-col gap-4">
            <FieldDisplay label="Sample Rate" value={meta.sampleRate}/>
            <FieldDisplay label="Bit Depth" value={meta.bitDepth}/>
            <FieldDisplay label="Channel Count" value={meta.channelCount}/>
            <FieldDisplay label="Sample Length" value={meta.sampleLength}/>
        </div>)
}