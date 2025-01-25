import {ClientConfig} from "@/lib/config-client";
import {ProcessOutput} from "@/lib/process-output";

type AppListener = (Element) => void

export class ChopApp {
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

    setScreen(e) {
        this.listener(e)
    }

    onErrors(errors: Error[]) {
        errors.forEach(console.error)
    }
}