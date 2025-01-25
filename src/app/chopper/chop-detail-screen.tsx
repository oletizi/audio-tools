import {useEffect, useState} from "react";
import {SampleMetadata} from "@/model/sample";
import {getMeta} from "@/lib/client-translator";
import IntField, {FieldDisplay} from "@/components/components-core";
import {Button} from "@mui/material";

export function ChopDetailScreen(
    {
        file,
        onErrors = (e) => console.error(e),
        doIt
    }: {
        file: string | null,
        onErrors: (e: Error | Error[]) => void,
        doIt: (samplesPerBeat: number, beatsPerChop: number) => void
    }) {
    const [meta, setMeta] = useState<SampleMetadata | null>(null)
    const [bpm, setBpm] = useState<number>(120)
    const [beatsPerChop, setBeatsPerChop] = useState<number>(4)
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

    return (
        <div className="flex flex-col gap-4">
            <div>Let's chop this sample! {file ? file : 'Choose a file!'}</div>
            <div><Metadata meta={meta}/></div>
            {meta ? (
                <>
                    <FieldDisplay label="Samples per Beat" value={getSamplesPerBeat()}/>
                    <FieldDisplay label="Total Chops" value={getTotalChops()}/>
                    <IntField defaultValue={bpm} label="BPM" max={200} min={40} onSubmit={v => setBpm(v)}/>
                    <IntField defaultValue={beatsPerChop} max={200} min={1} label="Beats per Chop"
                              onSubmit={v => setBeatsPerChop(v)}/>
                    <Button variant="contained" onClick={() => doIt(getSamplesPerBeat(), beatsPerChop)}>Do It!</Button>
                </>) : (<></>)}
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