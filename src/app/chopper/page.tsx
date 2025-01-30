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

    return (
        <div className="container mx-auto flex-column">
            <div className="flex" style={{height: 'calc((100vh / 12) * 1)'}}>
                <div className="mt-5 text-2xl text-red-600">Akai S3000XL Chopper</div>
            </div>
            <div className="flex gap-10" style={{maxHeight: '100vh'}}>
                <div className="w-1/2 border-2" style={{maxHeight: 'calc((100vh / 12) * 10)'}}>
                    <SampleSelectScreen app={app} onSelect={v => setFile(v)}/>
                </div>
                <div className="w-1/2 border-2 p-4">
                    <ChopDetailScreen app={app} defaultDirectory="/"
                                      file={file}
                                      doIt={(prefix: string, samplesPerBeat, beatsPerChop) => {
                                          if (file) {
                                              chopSample(file, prefix, samplesPerBeat, beatsPerChop).then()
                                          }
                                      }}
                                      onErrors={(e) => console.log(e)}/>
                </div>
            </div>
        </div>)
}

