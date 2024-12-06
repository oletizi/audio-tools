"use client"
import {FileList} from "@/components/file-list"
import {listSource, listTarget, cdSource, cdTarget} from "@/lib/client-translator";
import {useState} from "react";
import {DirectorySpec, FileSet, FileSpec} from "@/lib/lib-fs-api";

export default function Page() {
    const [source, updateSource] = useState<FileSet | null>(null)
    const [target, updateTarget] = useState<FileSet | null>(null)
    const filter = (f: File): boolean => {
        return f.name != undefined && !f.name.startsWith('.DS_Store')
    }

    function fetchSource() {
        listSource(filter).then(r => updateSource(r.data))
    }
    function fetchTarget() {
        listTarget(filter).then(r => updateTarget(r.data))
    }

    if (!source) {
        fetchSource()
    }
    if (!target) {
        fetchTarget()
    }

    function sourceSelect(f: FileSpec) {
        console.log(`Source select: `)
        console.log(f)
        if (f.isDirectory) {
            cdSource(f.name).then(fetchSource)
        }
    }

    function targetSelect(f: FileSpec) {
        if (f.isDirectory) {
            cdTarget(f.name).then(fetchTarget)
        }
    }

    return (<div className="container mx-auto">
        <div className="flex gap-10">
            <div className="flex-1">
                <div>From:</div>
                <FileList data={source} onSelect={sourceSelect}/>
            </div>
            <div className="flex-1">
                <div>To:</div>
                <FileList data={target} onSelect={targetSelect}/>
            </div>
        </div>
    </div>)
}
