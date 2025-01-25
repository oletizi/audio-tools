import {useEffect, useState} from "react";
import {SampleMetadata} from "@/model/sample";
import {getMeta} from "@/lib/client-translator";
import IntField, {FieldDisplay} from "@/components/components-core";

export function ChopDetailScreen({file, onErrors = (e) => console.error(e)}: { file: string | null }) {
    const [meta, setMeta] = useState<SampleMetadata | null>(null)
    const [bpm, setBpm] = useState<number>(120)
    useEffect(() => {
        if (file) {
            getMeta(file).then(r => {
                if (r.errors.length) {
                    onErrors(r)
                } else {
                    setMeta(r.data)
                }
            })
        }

    }, [file])
    return (
        <div className="flex flex-col">
            <div>Let's chop this sample! {file ? file : 'Choose a file!'}</div>
            <div><Metadata meta={meta}/></div>
            {meta ? (
                <>
                  <IntField defaultValue={bpm} label="BPM" max={200} min={40} onSubmit={v => setBpm(v)}/>  
                </>) : (<></>)}
        </div>
    )
}

function Metadata({meta}: { meta: SampleMetadata | null }) {
    if (!meta) {
        return (<></>)
    }
    return (
        <>
            <FieldDisplay label="Sample Rate" value={meta.sampleRate}/>
            <FieldDisplay label="Bit Depth" value={meta.bitDepth}/>
            <FieldDisplay label="Channel Count" value={meta.channelCount}/>
            <FieldDisplay label="Sample Length" value={meta.sampleLength}/>
        </>)
}