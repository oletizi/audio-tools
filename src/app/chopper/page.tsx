"use client"
import {ChopScreen} from "@/app/chopper/chop-screen";
import {newClientConfig} from "@/lib/config-client";
import {newClientOutput} from "@/lib/process-output";
import {useState} from "react";
import {ChopApp} from "@/app/chopper/chop-app";

const config = newClientConfig()
const out = newClientOutput(true, 'Chopper')
const app = new ChopApp(config, out)
export default function Page() {
    const [screen, setScreen] = useState(<ChopScreen app={app}/>)

    app.setListener(setScreen)
    return (<div className="container mx-auto">{screen}</div>)
}

