import {Output, WebMidi} from "webmidi"

export class Midi {
    async start(onEnabled = () => {
    }) {
        try {
            await WebMidi.enable()

            await onEnabled()
        } catch (err) {
            console.error(err)
            await WebMidi.disable()
        }
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
}
