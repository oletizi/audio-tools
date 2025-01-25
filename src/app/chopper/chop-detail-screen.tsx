import {useState} from "react";

export function ChopDetailScreen({file}: { file: string | null }) {
    const [meta, setMeta] = useState()
    return (<div>Let's chop this sample! {file ? file : 'Choose a file!'}</div>)
}