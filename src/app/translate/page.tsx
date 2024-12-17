"use client"
import {FileList, ItemAdornments, visitItem} from "@/components/file-list"
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
        if (f.isDirectory) {
            cdSource(f.name).then(fetchSource)
        }
    }

    function targetSelect(f: FileSpec) {
        if (f.isDirectory) {
            cdTarget(f.name).then(fetchTarget)
        }
    }

    // Define what should happen to items in the source list
    const sourceItemVisitor: visitItem = (f) => {
        const rv: ItemAdornments = {
            clickable: f.isDirectory || f.name.endsWith('.dsbundle') || f.name.endsWith('.xpm'),
            onClick(f: FileSpec | DirectorySpec): Promise<void> {
                if (f.isDirectory) {
                    cdSource(f.name).then(fetchSource)
                }
            },
            deletable: false,
            onDelete(f: FileSpec | DirectorySpec): Promise<void> {
                // noop
            },
            transformable: false,
            onTransform(f: FileSpec | DirectorySpec): Promise<void> {
                // TODO: implement transform
            },
        }
        return rv
    }

    // Define what shoul dhappen to times in the target list
    const targetItemVisitor: visitItem = (f) => {
        const rv: ItemAdornments = {
            clickable: false,
            onClick(f: FileSpec | DirectorySpec): void {
                if (f.isDirectory) {
                    cdTarget(f.name).then(fetchTarget)
                }
            },
            deletable: true,
            onDelete(f: FileSpec | DirectorySpec): void {
            },
            transformable: false,
            onTransform(f: FileSpec | DirectorySpec): void {
            },
        }
        return rv

    }

    const fileListClasses = "h-2/3 overflow-y-scroll border-neutral-100 border-solid border-2 rounded"

    return (<div className="container mx-auto h-screen">
        <div className="flex gap-10 h-full">
            <div className="flex-1">
                <div>From:</div>
                <FileList className={fileListClasses} data={source} onSelect={sourceSelect} visitor={sourceItemVisitor}/>
            </div>
            <div className="flex-1">
                <div>To:</div>
                <FileList className={fileListClasses} data={target} onSelect={targetSelect} visitor={targetItemVisitor}/>
            </div>
        </div>
    </div>)
}
