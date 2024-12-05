import {FileList} from "@/components/file-list"
import {listSource, listTarget} from "@/lib/client-translator";

export default async function Translate() {
    const filter = (f: File): boolean => {
        return f.name != undefined && !f.name.startsWith('.DS_Store')
    }
    const source = await listSource('/', filter)
    const target = await listTarget('/', filter)
    return (<div className="container mx-auto">
        <div className="flex gap-10">
            <div className="flex-1">
                <div>From:</div>
                <FileList data={source.data}/>
            </div>
            <div className="flex-1">
                <div>To:</div>
                <FileList data={target.data}/>
            </div>
        </div>
    </div>)
}
