import {Midi} from "@/midi/midi";
// noinspection TypeScriptCheckImport
import {format} from "roland-sysex.js"
/**
 * | Byte       | Description       |
 * + ---------- + ----------------- +
 * | 0xFO (240) | Start Sysex       |
 * | 0x41 ( 65) | Manufacturer ID   |
 * | DEV    | Device ID         |
 * | MDL    | Model ID          | 0x6A: JV-1080
 * | CMD    | Command ID        |
 * | [Body] | Main data         |
 * | 0xF7   | End Sysex         |
 */

/**
 * Example message from device
 * 0xF0 (240): Start Sysex
 * 0x41 ( 65): Manufacturer ID
 * 0x10 ( 16): Device ID
 * 0x6A (106): Model ID
 * 0x12 ( 18): Command ID
 *   0       : Data
 *   0       : Data
 *   0       : Data
 * 0x0C ( 12): Data
 *   0       : Data
 * 0x74 (116): Data
 * 0xF7 (247): End Sysex
 *
 */

/**
 * const generatedMessage = generate({
 *   manufacturerId: 0x41,
 *   deviceId: 0x10,
 *   modelId: 0x00,
 *   command: 0x12,
 *   data: [0x34]
 * });
 */

const ROLAND_MANUFACTURER_ID = 0x41
const JV_1080_MODEL_ID = 0x6A
const CMD_RQ1 = 0x11
const CMD_DT1 = 0x12

const BASE_SYSTEM = [0, 0, 0, 0]
const BASE_TEMP_PERFORMANCE = [0x01, 0, 0, 0]

export class Jv1080 {
    private readonly midi: Midi;
    private readonly deviceId: number;

    constructor(midi: Midi, deviceId: number) {
        this.midi = midi
        this.deviceId = deviceId
    }

    testSysex() {
        const msg = [0x01, 0x00, 0x00, 0x28, 0x06]
        //   return (128 - buf.reduce(function (a, b) {
        //     return (a + b) % 128;
        //   }, 0)) % 128;
        // let data = [CMD_DT1, 0x01, 0x00, 0x00, 0x28, 0x06, 0x51];
        const checksum = this.checksum(msg)
        console.log(`checksum: ${checksum}; expected 81`)
        msg.unshift(CMD_DT1)
        // msg.push(0x51)
        msg.push(checksum)
        this.midi.sendSysex(this.getIdentifier(), msg)
    }

    private checksum(msg: number[]) {
        return (128 - msg.reduce((acc, val) => (acc + val) % 128)) % 128
    }
    private getIdentifier() {
        return [ROLAND_MANUFACTURER_ID, this.deviceId, JV_1080_MODEL_ID];
    }
}