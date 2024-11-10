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

    ping(): Promise<any>
}

export function newS56kDevice(midi, out: ProcessOutput) {
    return new S56kSysex(midi, out)
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

    async ping() {
        const akaiID = 0x47
        const s56kId = 0x5E
        const deviceId = 0x00
        const userRef = 0x00
        const section = 0x00
        const item = 0x00
        const out = this.out
        const midi = this.midi
        return new Promise<any>((resolve, reject) => {
            function listener(event) {
                out.log(`MIDI MESSAGE IN PING!!!`)
                for (const name of Object.getOwnPropertyNames(event)) {
                    out.log(`PING RESPONSE: ${name} = ${event[name]}`)
                }
                // const message = event.message
                midi.removeListener('sysex', listener)
                resolve()
            }

            this.midi.addListener('sysex', listener)
            this.midi.sendSysex(akaiID, [s56kId, deviceId, userRef, section, item])
            this.out.log(`Done sending sysex.`)
        })
    }
}