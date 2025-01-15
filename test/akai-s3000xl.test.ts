import * as midi from 'midi'
import {expect} from "chai";
import {newDevice, SampleHeader} from "../src/midi/akai-s3000xl";

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

    it ('fetches sample header', async () => {
        const device = newDevice(input, output)
        const header = {} as SampleHeader
        const sampleNumber = 8
        await device.getSampleHeader(sampleNumber, header)
        expect(header.SNUMBER).eq(sampleNumber)
        expect(header.SHIDENT).eq(3) // Akai magic value
        expect(header.SSRVLD).eq(0x80) // Akai magic value
        console.log(header)
    })

    it('fetches resident program names', async() =>{
        const device = newDevice(input, output)
        const names = []
        await device.getProgramNames(names)
        console.log(`Sample names:`)
        console.log(names)
        expect(names).not.empty
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
        /*
        Byte 0: 0xF0 MIDI System Exclusive Identifier
        Byte 1: 0x47 Akai Manufacturer code
        Byte 2: ? MIDI Exclusive channel
        Byte 3: ? S3000 MIDI System Exclusive function code.
            Function codes that are specific to the S3000 start at 0x20.
        Byte 4: 0x48 S3000 Model identity.
            The S3000 shares the same model as the S1000.
        Bytes 5 & 6: ?,? Item index
            The 14 data bits contained in these two bytes select a data item. The type of item selected depends upon the function code, e.g. these two bytes may indicate program number, sample number etc.
            Additionally, the two uppermost bits (bits 6 and 5 of byte 6) have meaning when write operations are being performed (see below).
        Byte 7: ? Selector
            This byte holds additional selection data, e.g. keygroup number, type of miscellaneous data.
        Bytes 8 &9: ?, ? Byte offset into data item
        Bytes 10 &11: ?, ? Number of bytes of data

        OPCODES:

        */

        /*
        let data = [
            0xf0, // 00: (240) SYSEX_START
            0x47, // 01: ( 71) AKAI
            0x00, // 02: (  0) CHANNEL
            0x2c, // 03: ( 44) OPCODE
            0x48, // 04: ( 72) DEVICE ID
            0x09, // 05: (  9) Item index
            0x00, // 06: (  0) Item index
            0x00, // 07: (  0) Selector
            0x00, // 08: (  0) Data offset
            0x2a, // 09: ( 42) Data offset
            0x00, // 10: (  0) Byte count (msb)
            0x04, // 11: (  4) Byte count (lsb)
            0x00, // 12: (  0) Data
            0x00, // 13: (  0) Data
            0x00, // 14: (  0) Data
            0x00, // 15: (  0) Data
            0x00, // 16: (  0) Data
            0x04, // 17: (  4) Data *
            0x01, // 18: (  1) Data *
            0x05, // 19: (  5) Data *
            0x00, // 20: (  0) Data *
            0xf7  // 21: (247) SYSEX_END
        ]
*/
        /*
                // set trim start to 0
                data = [0xF0, 0x47, 0x00, 0x2C, 0x48, 0x09, 0x00, 0x00, 0x1E, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF7]
        */
        // set trim start to 0, 1, ...
        //  b: 00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20
        //      A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U
        // +------------------------------------------------------------------+
        //  0: F0 47 00 2C 48 09 00 00 1E 00 04 00 00 00 00 00 00 00 00 00 F7
        //  1: F0 47 00 2C 48 09 00 00 1E 00 04 00 01 00 00 00 00 00 00 00 F7
        //  2: F0 47 00 2C 48 09 00 00 1E 00 04 00 02 00 00 00 00 00 00 00 F7
        //  3: F0 47 00 2C 48 09 00 00 1E 00 04 00 03 00 00 00 00 00 00 00 F7
        // 15: F0 47 00 2C 48 09 00 00 1E 00 04 00 0F 00 00 00 00 00 00 00 F7
        // 16: F0 47 00 2C 48 09 00 00 1E 00 04 00 00 01 00 00 00 00 00 00 F7
        // 31: F0 47 00 2C 48 09 00 00 1E 00 04 00 0F 01 00 00 00 00 00 00 F7
        // 32: F0 47 00 2C 48 09 00 00 1E 00 04 00 00 02 00 00 00 00 00 00 F7

        //   F0,47,cc,RSDATA,48,
        //   ss,ss sample number\
        //   F7 eox\
        // Request names of resident samples
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

