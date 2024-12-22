import {Midi} from "@/midi/midi";
// noinspection TypeScriptCheckImport
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
const OFFSET_PANEL_MODE = [0, 0, 0, 0]
const OFFSET_PERFORMANCE_NUMBER = [0, 0, 0, 1]
const OFFSET_PATCH_GROUP = [0, 0, 0, 2]
const OFFSET_PATCH_GROUP_ID = [0, 0, 0, 3]
const BASE_TEMP_PERFORMANCE = [0x01, 0, 0, 0]

export class Jv1080 {
    private readonly midi: Midi;
    private readonly deviceId: number;

    constructor(midi: Midi, deviceId: number) {
        this.midi = midi
        this.deviceId = deviceId
    }

    private checksum(msg: number[]) {
        return (128 - msg.reduce((acc, val) => (acc + val) % 128)) % 128
    }

    private getIdentifier() {
        return [ROLAND_MANUFACTURER_ID, this.deviceId, JV_1080_MODEL_ID];
    }

    private set(msg: number[]) {
        console.log(`set msg:`)
        console.log(msg)
        this.sysex(CMD_DT1, msg)
    }

    private get(msg: number[]) {
        this.sysex(CMD_RQ1, msg)
    }

    private sysex(cmd: number, msg) {
        this.midi.sendSysex(this.getIdentifier(), [cmd].concat(msg).concat(this.checksum(msg)))
    }

    testSysex() {
        this.set([0x01, 0x00, 0x00, 0x28, 0x06])
    }


    panelModePerformance() {
        this.set(param(BASE_SYSTEM, OFFSET_PANEL_MODE).concat([0x00]))
    }

    panelModePatch() {
        this.set(param(BASE_SYSTEM, OFFSET_PANEL_MODE).concat([0x01]))
    }

    panelModeGm() {
        this.set(param(BASE_SYSTEM, OFFSET_PANEL_MODE).concat([0x02]))
    }

    setPerformanceNumber(n: number) {
        this.set(param(BASE_SYSTEM, OFFSET_PERFORMANCE_NUMBER).concat([n]))
    }

    patchGroupUser() {
        // this.set(param(BASE_SYSTEM, OFFSET_PATCH_GROUP).concat([0]))
        this.patchGroup(0)
    }

    patchGroupPcm() {
        // this.set(param(BASE_SYSTEM, OFFSET_PATCH_GROUP).concat[[1]])
        this.patchGroup(1)
    }
    private patchGroup(n:number) {
        this.set(param(BASE_SYSTEM, OFFSET_PATCH_GROUP).concat([n]))
    }

    setPatchGroupId(n: number) {
        this.set(param(BASE_SYSTEM, OFFSET_PATCH_GROUP_ID).concat([n]))
    }
}

function param(base: number[], offset: number[]) {
    return base.map((n, i) => n + offset[i])
}