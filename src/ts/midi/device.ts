/**
 * ## Sysex message structure
 * ```
 * <Start of SysEx> <AKAI ID> <S5000/6000 ID> <User-selectable Device ID> <User-Refs..> ...
 * ```
 *
 * Where the values of the bytes are:
 *```
 * <&F0> <&47> <&5E> <0..&7F> <0..&F7> ... {<240> <71> <94> <0..127> <0..247> ...}
 *```
 *
 * ## Complete control message
 * <&F0> <&47> <&5E> <0..&7F> <0..&7F> <...> <Section> <Item> <Data1> ... <DataN> <checksum> <&F7>
 *
 *  ## Sections
 *  +-----------+-------------------------------+
 *  | Section   | Description                   |
 *  +-----------+-------------------------------+
 *  | 0x00      | Sysex Configuration           |
 *  | 0x02      | System Setup                  |
 *  | 0x04      | MIDI Configuration            |
 *  | 0x06      | Keygroup Zone Manipulation    |
 *  | 0x08      | Keygroup Manipulation         |
 *  | 0x0A      | Program Manipulation          |
 *  | 0x0C      | Multi Manipulation            |
 *  | 0x0E      | Sample Tools                  |
 *  | 0x10      | Disk Tools                    |
 *  | 0x12      | Multi FX Control              |
 *  | 0x14      | Scenelist Manipulation        |
 *  | 0x16      | MIDI Songfile Tools           |
 *  | 0x20      | Front Panel Control           |
 *  | 0x2A      | Alt. Program Manipulation     |
 *  | 0x2C      | Alt. Multi Manipulation       |
 *  | 0x2E      | Alt. Sample Tools             |
 *  | 0x32      | Alt. Multi FX Control         |
 *  +-----------+-------------------------------+
 *
 * ### Section: Keygroup Zone
 *  +-----------+---------------+---------------+---------------------------+
 *  | Item      | Data 1        | Data 2        | Description               |
 *  |           | (Zone number) |               |                           |
 *  +-----------+----------------+--------------+---------------------------+
 *  | 0x21      | 0, 1-4        | N/A           | Get Zone Sample           |
 *  | 0x22      | 0, 1-4        | N/A           | Get Zone Level            |
 *  | ...       | ...           | ...           | ...                       |
 *  +-----------+---------------+---------------+---------------------------+
 */


import {Midi} from "./midi";
import {newClientOutput, ProcessOutput} from "../process-output";

const START_OF_SYSEX = 0xF0
const AKAI_ID = 0x47
const SAMPLER_ID = 0x5E
const DEVICE_ID = 0x00
const USER_REFS = 0x00

export interface S56kDevice {
    init()

    ping(): Promise<SysexResponse>
}

export function newS56kDevice(midi, out: ProcessOutput) {
    return new S56kSysex(midi, out)
}


enum ConfirmationStatus {
    OK = 79,
    DONE = 68,
    REPLY = 82,
    ERROR = 69
}

function getStatusMessage(status: number) {
    switch (status) {
        case ConfirmationStatus.OK:
            return "Ok"
        case ConfirmationStatus.DONE:
            return "Done"
        case ConfirmationStatus.REPLY:
            return "Reply"
        case ConfirmationStatus.ERROR:
            return "Error"
        default:
            return "Unknown"
    }
}

enum ErrorCode {
    NOT_SUPPORTED = 0,
    INVALID_FORMAT,
    PARAMETER_OUT_OF_RANGE
}


function getErrorMessage(errorCode: number) {
    switch (errorCode) {
        case 0:
            return "Error: Not supported"
        case 1:
            return "Error: Invalid message format"
        case 2:
            return "Error: Parameter out of range"
        case 3:
            return "Error: Device: Unknown error"
        case 4:
            return "Error: Not found"
        case 5:
            return "Error: Unable to create new element"
        case 6:
            return "Error: Unable to delete item"
        case 129:
            return "Error: Checksum invalid"
        case 257:
            return "Disk error: Selected disk invalid"
        case 258:
            return "Disk error: Error during load"
        case 259:
            return "Disk error: Item not found"
        case 260:
            return "Disk error: Unable to create"
        case 261:
            return "Disk error: Folder not empty"
        case 262:
            return "Disk error: Unable to delete"
        case 263:
            return "Disk error: Unknown error"
        case 264:
            return "Disk error: Error during save"
        case 265:
            return "Disk error: Insufficient space"
        case 266:
            return "Disk error: Media is write protected"
        case 267:
            return "Disk error: Name not unique"
        case 268:
            return "Disk error: Invalid disk handle"
        case 269:
            return "Disk error: Disk is empty"
        case 270:
            return "Disk error: Aborted"
        case 271:
            return "Disk error: Failed on open"
        case 272:
            return "Disk error: Read error"
        case 273:
            return "Disk error: Disk not ready"
        case 274:
            return "Disk error: SCSI error"
        case 385:
            return "Program error: Requested keygroup does not exist"
        default:
            return "Error code unknown"
    }
}

export interface SysexResponse {
    // 94 (product id)
    // 0  (deviceId)
    // 0  (userRef)
    // 79 ('O':OK) | 68 ('D':DONE) | 82 ('R':REPLY) | 69 ('E': ERROR)
    // 0  (Data 1)
    // 0  (Data 2)
    productId: number
    deviceId: number
    userRef: number
    status: ConfirmationStatus
    errorCode: number
    message: string
}

function newResponse(event) {
    const data = event['dataBytes']
    const rv = {} as SysexResponse
    if (data && data.length >= 6) {
        rv.productId = data[0]
        rv.deviceId = data[1]
        rv.userRef = data[2]
        rv.status = data[3]

        if (rv.status === ConfirmationStatus.ERROR) {
            rv.errorCode = data[4] * 128 + data[5]
            rv.message = getErrorMessage(rv.errorCode)
        } else {
            rv.errorCode = -1
            rv.message = getStatusMessage(rv.status)
        }
        rv.message += ` at ${event.timestamp}`
    } else {
        rv.productId = -1
        rv.deviceId = -1
        rv.userRef = -1
        rv.status = ConfirmationStatus.ERROR
        rv.errorCode = -1
        rv.message = "Unknown"
    }
    return rv as SysexResponse
}

enum Section {
    SYSEX_CONFIG = 0x00,
    SYSTEM_SETUP = 0x02,
    MIDI_CONFIG = 0x04,
    KEYGROUP_ZONE = 0x06,
    KEYGROUP = 0x08,
    PROGRAM = 0x0A,
    MULTI = 0x0C,
    SAMPLE_TOOLS = 0x0E,
    DISK_TOOLS = 0x10,
    FX = 0x12,
    SCENLIST = 0x14,
    SONGFILE = 0x16,
    FRONT_PANEL = 0x20,
    ALT_PROGRAM = 0x2A,
    ALT_MULTI = 0x2C,
    ALT_SAMPLE = 0x2E,
    ALT_FX = 0x32
}

class Item {
    private readonly code: number;

    constructor(code: number) {
        this.code = code
    }

    getCode(): number {
        return this.code
    }
}

enum SysexItem {
    QUERY = 0x00
}

enum ProgramItem {

}
interface SysexControlMessage {
    section: Section
    item: Item
    data: number[]
}

class S56kSysex implements S56kDevice {
    private readonly midi: Midi;
    private readonly out: ProcessOutput;

    constructor(midi, out: ProcessOutput = newClientOutput()) {
        this.midi = midi
        this.out = out
    }

    init() {
    }

    async ping(): Promise<SysexResponse> {
        // const akaiID = 0x47
        // const s56kId = 0x5E
        // const deviceId = 0x00
        // const userRef = 0x00
        // const section = 0x00
        // const item = 0x00
        // const out = this.out
        // const midi = this.midi
        // return new Promise<any>((resolve, reject) => {
        //     let eventCount = 0
        //
        //     function listener(event) {
        //         eventCount++
        //         for (const name of Object.getOwnPropertyNames(event)) {
        //             out.log(`PING RESPONSE ${eventCount}: ${name} = ${event[name]}`)
        //         }
        //         let response = newConfirmationMessage(event);
        //
        //         if (response.errorCode < 0 || eventCount >= 1) {
        //             midi.removeListener('sysex', listener)
        //             resolve(response)
        //         }
        //     }
        //
        //     this.midi.addListener('sysex', listener)
        //     this.midi.sendSysex(akaiID, [s56kId, deviceId, userRef, section, item])
        //     this.out.log(`Done sending sysex.`)
        // })
        return this.request({
            section: Section.SYSEX_CONFIG,
            item: new Item(SysexItem.QUERY),
            data: []
        } as SysexControlMessage)
    }

    async request(message: SysexControlMessage): Promise<SysexResponse> {
        const midi = this.midi
        const out = this.out
        const akaiID = 0x47
        const s56kId = 0x5E
        const deviceId = 0x00
        const userRef = 0x00
        return new Promise<any>((resolve, reject) => {
            let eventCount = 0

            function listener(event) {
                eventCount++
                for (const name of Object.getOwnPropertyNames(event)) {
                    out.log(`SYSEX RESPONSE ${eventCount}: ${name} = ${event[name]}`)
                }
                let response = newResponse(event);

                if (response.errorCode < 0 || eventCount >= 1) {
                    midi.removeListener('sysex', listener)
                    resolve(response)
                }
            }

            this.midi.addListener('sysex', listener)
            this.midi.sendSysex(akaiID, [s56kId, deviceId, userRef, message.section, message.item.getCode()].concat(message.data))
            this.out.log(`Done sending sysex.`)
        })
    }
}