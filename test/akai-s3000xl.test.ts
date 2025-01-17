import midi from 'midi'
import {expect} from "chai";
import {newDevice} from "../src/midi/akai-s3000xl";
import {KeygroupHeader, ProgramHeader, SampleHeader} from "../src/midi/devices/s3000xl";

function listenForMessage(input) {
    return new Promise<midi.MidiMessage>((resolve, reject) => {
        input.on('message', function (deltaTime, message) {
            resolve(message)
        })
        setTimeout(() => reject(), 2 * 1000)
    })
}

function init(io) {
    for (let i = 0; i < io.getPortCount(); i++) {
        if (io.getPortName(i).startsWith('IAC')) {
            continue
        }
        console.log(`Opening port ${io.getPortName(i)}`)
        io.openPort(i)
        break
    }
    return io
}

let input, output

function midiSetup() {
    output = init(new midi.Output())
    input = init(new midi.Input())
    input.ignoreTypes(false, false, false)
}

function midiTeardown() {
    input?.closePort()
    output?.closePort()
}

describe('akai-s3000xl tests', () => {
    before(midiSetup)
    after(midiTeardown)

    it('fetches resident sample names', async () => {
        const device = newDevice(input, output)
        const names = []
        await device.getSampleNames(names)
        expect(names).not.empty
    })

    it('fetches sample header', async () => {
        const device = newDevice(input, output)
        const header = {} as SampleHeader
        const sampleNumber = 8
        await device.getSampleHeader(sampleNumber, header)
        console.log(header)
        expect(header['SNUMBER']).eq(sampleNumber)
        expect(header.SHIDENT).eq(3) // Akai magic value
        expect(header.SSRVLD).eq(0x80) // Akai magic value
    })

    it('fetches resident program names', async () => {
        const device = newDevice(input, output)
        const names = []
        await device.getProgramNames(names)
        console.log(`Sample names:`)
        console.log(names)
        expect(names).not.empty
    })

    it('fetches program header', async () => {
        const device = newDevice(input, output)
        const programNumber = 3
        const header = {} as ProgramHeader
        await device.getProgramHeader(programNumber, header)
        console.log(header)
    })

    it( 'fetches keygroup header', async () => {
        const device = newDevice(input, output)
        const programNumber = 3
        const keygroupNumber = 1
        const header = {} as KeygroupHeader
        await device.getKeygroupHeader(programNumber, keygroupNumber, header)
        expect(header['PNUMBER']).equal(programNumber)
        expect(header['KNUMBER']).equal(keygroupNumber)
        expect(header.KGIDENT).equal(2) // magic Akai number
        console.log(header)
    })
})

describe('basic sysex tests', () => {
    before(midiSetup)
    after(midiTeardown)


    it('Initializes midi', () => {
        expect(output).to.exist
        expect(input).to.exist
    })

    it(`Sends sysex`, async () => {
        let data
        let listener = listenForMessage(input)
        data = [0xF0, 0x47, 0x00, 0x04, 0x48, 0xF7]
        console.log(`Requesting names of resident samples...`)
        output.sendMessage(data)

        let message = await listener
        console.log(`Received message.`)
        console.log(message)

        // request header for sample 0x09
        listener = listenForMessage(input)
        data = [0xF0, 0x47, 0x00, 0x0a, 0x48, 0x09, 0x00, 0xf7]
        console.log(`Requesting header for sample 0x09...`)
        output.sendMessage(data)
        message = await listener
        console.log(`Received message:`)
        console.log(message)
    })
})

describe('basic node midi tests', () => {
    it('gets a midi input', () => {
        const input = new midi.Input()
        expect(input).to.exist
        expect(input.getPortCount()).gte(1)
        for (let i = 0; i < input.getPortCount(); i++) {
            console.log(`Input [${i}]: ${input.getPortName(i)}`)
        }
    })

    it('gets a midi output', () => {
        const output = new midi.Output()
        expect(output).to.exist
        expect(output.getPortCount()).gte(1)
        for (let i = 0; i < output.getPortCount(); i++) {
            console.log(`Output [${i}]: ${output.getPortName(i)}`)
        }
    })

    it('sends and receives messages...', async () => {
        const input = new midi.Input()
        const output = new midi.Output()

        input.ignoreTypes(false, false, false)

        const received = new Promise<midi.MidiMessage>((resolve) => {

            input.on('message', (deltaTime, message) => {
                input.closePort()
                output.closePort()
                resolve(message)
            })

        })

        // on MacOS, this will be the IAC bus; other platforms, YMMMV
        input.openPort(0)
        output.openPort(0)

        const data = [176, 22, 1];
        output.sendMessage(data)

        const m = await received
        for (let i = 0; i < data.length; i++) {
            expect(m[i]).eq(data[i])
        }

    })
})

