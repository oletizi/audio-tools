import {Input, Output, WebMidi} from "webmidi"

export class Midi {
    private output: Output;
    private input: Input;

    async start(onEnabled = () => {
    }) {
        try {
            await WebMidi.enable()
            if (WebMidi.outputs && WebMidi.outputs.length > 0) {
                this.output = WebMidi.outputs[0]
            }
            if (WebMidi.inputs && WebMidi.inputs.length > 0) {
                this.input = WebMidi.inputs[0]
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

    setInput(input: Input) {
        this.input = input
    }

    async getOutputs() {
        return WebMidi.outputs
    }

    async getInputs() {
        return WebMidi.inputs
    }

    async getCurrentOutput() {
        return this.output
    }

    async getCurrentInput() {
        return this.input
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

    isCurrentInput(name: string) {
        return this.input && this.input.name === name
    }

    async setOutputByName(name) {
        let updated = false
        const selected = (await this.getOutputs()).filter(output => output.name == name)
        if (selected.length ==1) {
            this.output = selected[0]
            updated = true
        }
        return updated
    }

    // XXX: Refactor to generalize setting output & input by name in a single function
    async setInputByName(name) {
        let updated = false
        const selected = (await this.getInputs()).filter(input => input.name == name)
        if (selected.length == 1) {
            this.input = selected[0]
            updated = true
        }
        return updated
    }

}
