"use client"
import {FileList} from "@/components/file-list"
import {listSource} from "@/lib/client-translator";
import {useState} from "react";
import {FileSet} from "@/lib/lib-fs-api";

export default function Page() {
    const [set, updateSet] = useState<FileSet | null>(null)
    const filter = (f: File): boolean => {
        return f.name != undefined && !f.name.startsWith('.DS_Store')
    }
    if (set == null) {
        listSource('/', filter).then(r => updateSet(r.data))
        return (<div>Waiting...</div>)
    } else {
        return (<div className="container mx-auto">
            <div className="flex gap-10">
                <div className="flex-1">
                    <div>From:</div>
                    <FileList data={set}/>
                </div>
            </div>
        </div>)
    }
}
