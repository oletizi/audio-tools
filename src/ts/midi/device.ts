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


enum ResponseStatus {
    OK = 79,
    DONE = 68,
    REPLY = 82,
    ERROR = 69
}

function getStatusMessage(status: number) {
    switch (status) {
        case ResponseStatus.OK:
            return "Ok"
        case ResponseStatus.DONE:
            return "Done"
        case ResponseStatus.REPLY:
            return "Reply"
        case ResponseStatus.ERROR:
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
    status: ResponseStatus
    errorCode: number
    message: string
    section: number
    item: number
    data: number[]
}

function newResponse(event) {
    const data = event['dataBytes']
    const rv = {} as SysexResponse
    if (data && data.length >= 6) {
        let cursor = 0
        rv.productId = data[cursor++]
        rv.deviceId = data[cursor++]
        rv.userRef = data[cursor++]
        rv.status = data[cursor++]
        rv.data = []

        if (rv.status == ResponseStatus.REPLY) {
            // Reply messages have a section byte and an item byte before the data byte
            rv.section = data[cursor++]
            rv.item = data[cursor++]
        }
        for (; cursor < data.length; cursor++) {
            rv.data.push(data[cursor])
        }

        if (rv.status === ResponseStatus.ERROR) {
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
        rv.status = ResponseStatus.ERROR
        rv.errorCode = -1
        rv.message = "Unknown"
        rv.data = []
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

interface Item {
    getCode(): number
}

enum SysexItem {
    QUERY = 0x00
}

enum ProgramItem {
    GET_PROGRAM_COUNT = 0x10,
    GET_CURRENT_PROGRAM_ID = 0x11,
    GET_CURRENT_PROGRAM_INDEX = 0x12,
    GET_CURRENT_PROGRAM_NAME = 0x13,
    GET_CURRENT_PROGRAM_KEYGROUP_COUNT = 0x14,
    GET_CURRENT_PROGRAM_KEYGROUP_CROSSFADE = 0x15,
}

interface SysexControlMessage {
    section: Section
    item: number
    data: number[]
}

function newControlMessage(section: Section, item: number, data: number[]): SysexControlMessage {
    return {
        section: section,
        item: item,
        data: data
    } as SysexControlMessage
}

interface Result {
    errors: Error[]
    data: any
}

interface NumberResult extends Result {
    data: number
}


function numberResult(res: SysexResponse, bytes: number) {
    const rv = {
        errors: []
    } as NumberResult
    if (res.status == ResponseStatus.REPLY && res.data && res.data.length >= bytes) {
        rv.data = 0
        // XXD: I'm sure there's a more elegant way to do this, but I can't math.
        let magnitude = (bytes - 1) * 128
        for (let i = 0; i < bytes; i++) {
            rv.data += res.data[i] * (magnitude)
            magnitude /= 128
        }
    } else {
        console.log(`HEREl !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
        console.log(`response is not a reply`)
        rv.errors.push(new Error(`${res.status}: ${res.message}`))
    }
    return rv
}

export interface ProgramInfo {
    programCount: number
    currentProgramId: number
    currentProgramIndex: number
    keygroupCount: number
}

export interface ProgramInfoResult extends Result {
    data: ProgramInfo
}

export function newS56kDevice(midi, out: ProcessOutput) {
    return new S56kSysex(midi, out)
}

export interface S56kDevice {
    init()

    ping(): Promise<SysexResponse>

    getProgramInfo(): Promise<ProgramInfoResult>

    getProgramCount(): Promise<NumberResult>

    getProgramId(): Promise<NumberResult>

    getProgramIndex(): Promise<NumberResult>

    keygroupCount(): Promise<NumberResult>

}


class S56kSysex implements S56kDevice {
    private readonly midi: Midi;
    private readonly out: ProcessOutput;

    constructor(midi, out: ProcessOutput = newClientOutput()) {
        this.midi = midi
        this.out = out
    }

    init() {
        const out = this.out
        let sequence = 0
        this.midi.addListener('sysex', (event) => {
            const count = sequence++
            for (const name of Object.getOwnPropertyNames(event)) {
                out.log(`MONITOR: ${count}: ${name} = ${event[name]}`)
            }
        })
    }

    async getProgramInfo() {
        const rv = {
            errors: [],
            data: null
        } as ProgramInfoResult
        const programCount = await this.getProgramCount()
        const programId = await this.getProgramId()
        const programIndex = await this.getProgramIndex()
        const keygroupCount = await this.keygroupCount()
        rv.errors = rv.errors
            .concat(programCount.errors)
            .concat(programId.errors)
            .concat(programIndex.errors)
            .concat(keygroupCount.errors)
        rv.data = {
            programCount: programCount.data,
            programId: programId.data,
            programIndex: programIndex.data,
            keygroupCount: keygroupCount.data
        } as ProgramInfo
        return rv
    }

    async getProgramCount() {
        const res = await this.request(newControlMessage(Section.PROGRAM, ProgramItem.GET_PROGRAM_COUNT, []))
        this.out.log(`SysexResponse: ${res.status}: ${getStatusMessage(res.status)}`)
        this.out.log(`SysexResponse: section: ${res.section}; item: ${res.item}`)
        return numberResult(res, 2)
    }

    async getProgramId() {
        const res = await this.request(newControlMessage(Section.PROGRAM, ProgramItem.GET_CURRENT_PROGRAM_INDEX, []))
        return numberResult(res, 2)
    }

    async getProgramIndex(): Promise<NumberResult> {
        return numberResult(
            await this.request(newControlMessage(Section.PROGRAM, ProgramItem.GET_CURRENT_PROGRAM_INDEX, [])),
            2
        )
    }

    async keygroupCount(): Promise<NumberResult> {
        this.out.log(`HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
        this.out.log(`keygroupCount: Sending request...`)
        let res = await this.request(newControlMessage(Section.PROGRAM, ProgramItem.GET_CURRENT_PROGRAM_KEYGROUP_COUNT, []));
        this.out.log(`HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`)
        this.out.log(`keygroupCount: status: ${res.status}`)
        return numberResult(
            res,
            1
        )
    }

    async ping(): Promise<SysexResponse> {
        return this.request({
            section: Section.SYSEX_CONFIG,
            item: SysexItem.QUERY,
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
                for (const name of Object.getOwnPropertyNames(event)) {
                    out.log(`SYSEX RESPONSE ${eventCount}: ${name} = ${event[name]}`)
                }
                let response = newResponse(event);
                if (response.status == ResponseStatus.OK) {
                    out.log(`SYSEX RESPONSE: ${eventCount}: OK`)
                } else {
                    out.log(`SYSEX RESPONSE: ${eventCount}: ${response.status}; Resolving.`)
                    midi.removeListener('sysex', listener)
                    resolve(response)
                }
                eventCount++
            }

            this.midi.addListener('sysex', listener)
            let data = [s56kId, deviceId, userRef, message.section, message.item].concat(message.data);
            out.log(`Sending sysex data: ${data}`)
            this.midi.sendSysex(akaiID, data)
            this.out.log(`Done sending sysex.`)
        })
    }


}