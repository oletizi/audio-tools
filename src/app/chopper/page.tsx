"use client"
import {SampleSelectScreen} from "@/app/chopper/sample-select-screen";
import {newClientConfig} from "@/lib/config-client";
import {newClientOutput} from "@/lib/process-output";
import {ChopApp} from "@/app/chopper/chop-app";
import {ChopDetailScreen} from "@/app/chopper/chop-detail-screen";
import {useState} from "react";
import {chopSample} from "@/lib/client-translator";

const config = newClientConfig()
const out = newClientOutput(true, 'Chopper')
const app = new ChopApp(config, out)
export default function Page() {
    const [file, setFile] = useState<string | null>(null)
    // app.setListener(() => {})

    return (<div className="container mx-auto">
        <div className="flex gap-4">
            <div className="w-1/2">
                <SampleSelectScreen app={app} onSelect={v => setFile(v)}/>
            </div>
            <div className="grow">
                <ChopDetailScreen app={app} defaultDirectory="/"
                                  file={file}
                                  doIt={(prefix:string, samplesPerBeat, beatsPerChop) => {
                                      if (file) {
                                          chopSample(file, prefix, samplesPerBeat, beatsPerChop).then()
                                      }
                                  }}
                                  onErrors={(e) => console.log(e)}/>
            </div>
        </div>
    </div>)
}

