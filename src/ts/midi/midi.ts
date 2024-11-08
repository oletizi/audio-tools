import {WebMidi} from "webmidi"

export class Midi {
    async start(onEnabled = () => {
    }) {
        await WebMidi.enable()
        WebMidi.inputs.forEach(input => console.log(input.name))
        onEnabled()
    }

    async stop() {
        await WebMidi.disable()
    }
}
