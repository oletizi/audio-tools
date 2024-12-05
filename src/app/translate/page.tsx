import {FileList} from "@/components/file-list"
import {newClientCommon} from "@/client/client-common";
const client = newClientCommon((msg) => console.log(msg), (msg) => console.error(msg))
export default function Translate() {
    const config = client.fetchServerConfig()
    return (<div className="container mx-auto">
        <FileList/>
    </div>)
}
