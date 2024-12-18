"use client"
import {FileList, ItemAdornments, visitItem} from "@/components/file-list"
import {listSource, listTarget, cdSource, cdTarget, mkdirTarget, rmTarget, translate} from "@/lib/client-translator";
import {useState} from "react";
import {DirectorySpec, FileSet, FileSpec} from "@/lib/lib-fs-api";
import NewDirectory from "@/components/new-directory";

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

    // Define what should happen to items in the source list
    const sourceItemVisitor: visitItem = (f) => {
        const rv: ItemAdornments = {
            clickable: f.isDirectory ,
            onClick(f: FileSpec | DirectorySpec): Promise<void> {
                if (f.isDirectory) {
                    cdSource(f.name).then(fetchSource)
                }
            },
            deletable: false,
            onDelete(): Promise<void> {
                // noop
            },
            translatable: f.name.endsWith('.dspreset') || f.name.endsWith('.xpm'),
            onTranslate(f: FileSpec | DirectorySpec): Promise<void> {
                translate(f.name).then(fetchTarget)
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
            deletable: !f.name.startsWith('..'),
            onDelete(f: FileSpec | DirectorySpec): void {
                rmTarget(f.name).then(fetchTarget)
            },
            translatable: false,
            onTranslate(): void {
                // noop
            },
        }
        return rv
    }

    const fileListClasses = "h-2/3 overflow-y-scroll border-neutral-100 border-solid border-2 rounded"

    return (<div className="container mx-auto">
        <div className="flex gap-10 h-full">
            <div className="flex-1">
                <div className="flex flex-col gap-3 h-screen">
                    <div>From:</div>
                    <FileList className={fileListClasses} data={source} visit={sourceItemVisitor}/>
                </div>
            </div>
            <div className="flex-1">
                <div className="flex flex-col gap-3 h-screen">
                    <div>To:</div>
                    <FileList className={fileListClasses} data={target} visit={targetItemVisitor}/>
                    <NewDirectory inputHandler={(dirname: string) => mkdirTarget(dirname).then(fetchTarget)}/>
                </div>
            </div>
        </div>
    </div>)
}
