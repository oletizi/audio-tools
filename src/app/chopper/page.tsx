"use client"
import {ChopScreen} from "@/components/chop-screen";
import {ClientConfig, newClientConfig} from "@/lib/config-client";
import {newClientOutput, ProcessOutput} from "@/lib/process-output";
import {useState} from "react";

type AppListener = (Element) => void

class ChopApp {
    private readonly config: ClientConfig;
    private readonly out: ProcessOutput;
    private listener: AppListener = () => {
    }

    constructor(config: ClientConfig, out: ProcessOutput) {
        this.config = config;
        this.out = out;
    }

    setListener(l: AppListener) {
        this.listener = l
    }

    setScreen(e: Element) {
        this.listener(e)
    }
}

const config = newClientConfig()
const out = newClientOutput(true, 'Chopper')
const app = new ChopApp(config, out)
export default function Page() {
    const [screen, setScreen] = useState(<ChopScreen/>)
    app.setListener(setScreen)
    return (<div className="container mx-auto">{screen}</div>)
}

