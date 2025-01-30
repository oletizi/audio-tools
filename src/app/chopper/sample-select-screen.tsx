import {useEffect, useState} from "react";
import {DirectorySpec, FileSet, FileSpec} from "@/lib/lib-fs-api";
import {cdSource, listSource} from "@/lib/client-translator";
import {FileList, newItemAdornments} from "@/components/file-list"

export function SampleSelectScreen({onSelect, onErrors = e => console.error(e)}: {
    onSelect: (v: string) => void,
    onErrors?: (e: Error[]) => void
}) {
    const [dir, setDir] = useState<string>('/')
    const [files, setFiles] = useState<FileSet>(null)
    useEffect(() => {
        listSource().then(r => {
            if (r.errors.length > 0) {
                onErrors(r.errors)
            } else {
                setFiles(r.data)
                setDir('/' + r.data.path.join('/'))
            }
        })
    }, [dir])

    function visitItem(item: FileSpec | DirectorySpec) {
        const rv = newItemAdornments()
        rv.clickable = item.isDirectory
        rv.translatable = (!item.isDirectory) && item.name.toUpperCase().endsWith('.WAV')
        rv.onClick = () => {
            setDir(item.name)
        }
        rv.onTranslate = () => {
            //app.setScreen(<ChopDetailScreen file={item.name}/>)
            onSelect(item.name)
        }
        return rv
    }

    return (
        <div className="flex-col" style={{height: 'calc((100vh / 12) * 10)', overflow: 'auto'}}>
            <div className="h-14">
                <div className="pl-4 pt-4">Source: {dir}</div>
            </div>
            <FileList className="border-t-2" data={files} visit={visitItem}/>
        </div>
    )
}