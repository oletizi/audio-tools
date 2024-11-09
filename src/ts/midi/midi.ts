import {Output, WebMidi} from "webmidi"

export class Midi {
    private output: Output;

    async start(onEnabled = () => {
    }) {
        try {
            await WebMidi.enable()
            if (WebMidi.outputs && WebMidi.outputs.length > 0) {
                this.output = WebMidi.outputs[0]
            }
            await onEnabled()
        } catch (err) {
            console.error(err)
            await WebMidi.disable()
        }
    }

    setOutput(output: Output) {
        this.output = output
    }

    async getOutputs() {
        return WebMidi.outputs
    }

    async stop(onDisabled: () => void = () => {
    }) {
        await WebMidi.disable()
        await onDisabled()
    }

    async getOutput(name: string) {
        let rv: Output | null = null
        await (await this.getOutputs()).forEach(output => {
            if (output.name === name) {
                rv = output
            }
        })
        return rv
    }

    isCurrentOutput(name: string) {
        return this.output && this.output.name === name
    }
}
