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

import {Output} from "webmidi";
import {Midi} from "@/midi/midi";

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

const ROLAND_MANUFACTURER_ID = 0x41
const JV_1080_MODEL_ID = 0x6A

export class Jv1080 {
    private readonly midi: Midi;
    private readonly deviceId: number;
    constructor(midi: Midi, deviceId: number) {
        this.midi = midi
        this.deviceId = deviceId
    }

    testSysex() {
        this.midi.sendSysex([ROLAND_MANUFACTURER_ID, this.deviceId, JV_1080_MODEL_ID],
            [0x12, 0x01, 0x00, 0x00, 0x28, 0x06, 0x51])
    }
}