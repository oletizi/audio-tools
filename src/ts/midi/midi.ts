import {Input, InputEventMap, Output, WebMidi} from "webmidi"
import {newClientOutput, ProcessOutput} from "../process-output";

export class Midi {
    private output: Output;
    private input: Input;
    private listeners = []
    private out: ProcessOutput;
    constructor(out:ProcessOutput = newClientOutput()) {
        this.out = out
    }
    async start(onEnabled = () => {
    }) {
        try {
            await WebMidi.enable({sysex: true})

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
        if (this.input) {
            // removed listeners from the previous input
            for (const spec of this.listeners) {
                this.input.removeListener(spec.eventName, spec.eventListener)
            }
        }
        if (input) {
            // attach listeners to the current input
            for(const spec of this.listeners) {
                input.addListener(spec.eventName, spec.eventListener)
            }
        }
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
        if (selected.length == 1) {
            this.setOutput(selected[0])
            updated = true
        }
        return updated
    }

    // XXX: Refactor to generalize setting output & input by name in a single function
    async setInputByName(name) {
        let updated = false
        const selected = (await this.getInputs()).filter(input => input.name == name)
        if (selected.length == 1) {
            // this.input = selected[0]
            this.setInput(selected[0])
            updated = true
        }
        return updated
    }

    addListener(eventName: Symbol | keyof InputEventMap, eventListener: (event) => void) {
        this.listeners.push({eventName: eventName, eventListener: eventListener})
        this.input.addListener(eventName, eventListener)
    }
}
