import * as midi from 'midi'
import {byte2nibblesLE, bytes2numberLE, nibbles2byte} from "@/lib/lib-core";
import {newClientOutput} from "@/lib/process-output";
import {
    KeygroupHeader, parseKeygroupHeader,
    parseProgramHeader,
    parseSampleHeader,
    ProgramHeader,
    SampleHeader
} from "@/midi/devices/s3000xl";

// export interface ProgramHeader {
//     TRANSPOSE: number;
//     B_MODE: number;
//     B_PTCHD: number;
//     LEGATO: number;
//     VSSCL: number;
//     VOSCL: number;
//     K_LDEL: number;
//     K_LDEP: number;
//     K_LRAT: number;
//     PTUNO: number;
//     SPFILT: number;
//     SPATT: number;
//     SPLOUD: number;
//     VASSOQ: number;
//     PLAW: number;
//     DESYNC: number;
//     COHERE: number;
//     MW_PAN: number;
//     ECHOUT: number;
//     TEMPER: string;
//     TPNUM: number;
//     GROUPS: number;
//     KXFADE: number;
//     P_PTCH: number;
//     B_PTCH: number;
//     VELDEP: number;
//     PRSDEP: number;
//     MWLDEP: number;
//     LFODEL: number;
//     LFODEP: number;
//     LFORAT: number;
//     K_PANP: number;
//     PANDEL: number;
//     PANDEP: number;
//     PANRAT: number;
//     P_LOUD: number;
//     K_LOUD: number;
//     V_LOUD: number;
//     PRLOUD: number;
//     PANPOS: number;
//     STEREO: number;
//     OUTPUT: number;
//     OSHIFT: number;
//     PLAYHI: number;
//     PLAYLO: number;
//     PRIORT: number;
//     POLYPH: number;
//     PMCHAN: number;
//     PRGNUM: number;
//     PRNAME: string;
//     KGRP1: number;
//     PRIDENT: number;
//     PNUMBER: number;
//
// }

// export interface SampleHeader {
//     // Loop 1
//     LDWELL_1: number;
//     LLNGTH_1: number;
//     LOOPAT_1: number;
//     // Loop 2
//     LDWELL_2: number;
//     LLNGTH_2: number;
//     LOOPAT_2: number;
//     // Loop 3
//     LDWELL_3: number;
//     LLNGTH_3: number;
//     LOOPAT_3: number;
//     // Loop 4
//     LDWELL_4: number;
//     LLNGTH_4: number;
//     LOOPAT_4: number;
//
//     // Relative loop factors
//     SLXY_1: number
//     SLXY_2: number
//     SLXY_3: number
//     SLXY_4: number
//
//     SSPARE: number
//     SWCOMM: number
//     SSPAIR: number
//
//     SSRATE: number
//     SHLTO: number
//
//     SMPEND: number;
//     SSTART: number;
//     SLNGTH: number;
//     SLOCAT: number;
//     STUNO: { cent: number, semi: number };
//     SPTYPE: number;
//     SALOOP: number;
//     SLOOPS: number;
//     SSRVLD: number;
//     SHNAME: string
//     SPITCH: number;
//     SBANDW: number;
//     SNUMBER: number;
//     SHIDENT: number;
//
// }

export interface Device {

    getSampleNames(names: any[])

    getSampleHeader(sampleNumber: number, header: SampleHeader)

    getProgramNames(names: any[])

    getProgramHeader(programNumber: number, header: ProgramHeader)

    getKeygroupHeader(programNumber: number, keygroupNumber: number, header: KeygroupHeader)
}

export function newDevice(input: midi.Input, output: midi.Output): Device {
    return new s3000xl(input, output)
}


// noinspection JSUnusedGlobalSymbols
enum Opcode {
    // ID	Mnemonic	Direction	Description
    // 00h	RSTAT	<	request S1000 status
    RSTAT = 0x00,
    // 01h	STAT	>	S1000 status report
    STAT,
    // 02h	RPLIST	>	request list of resident program names
    RPLIST,
    // 03h	PLIST	>	list of resident program names
    PLIST,
    // 04h	RSLIST	<	request list of resident sample names
    RLIST,
    // 05h	SLIST	>	list of resident sample names
    SLIST,
    // 06h	RPDATA	<	request program common data
    RPDATA,
    // 07h	PDATA	<>	program common data
    PDATA,
    // 08h	RKDATA	<	request keygroup data
    RKDATA,
    // 09h	KDATA	<>	keygroup data
    KDATA,
    // 0Ah	RSDATA	<	request sample header data
    RSDATA,
    // 0Bh	SDATA	<>	sample header data
    SDATA,
    // 0Ch	RSPACK	<	request sample data packet(s)
    RSPACK,
    // 0Dh	ASPACK	<	accept sample data packet(s)
    ASPACK,
    // 0Eh	RDDATA	<	request drum settings
    OxRDDATA,
    // 0Fh	DDATA	<>	drum input settings
    DDATA,
    // 10h	RMDATA	<	request miscellaneous data
    RMDATA,
    // 11h	MDATA	<>	miscellaneous data
    MDATA,
    // 12h	DELP	<	delete program and its keygroup
    DELP,
    // 13h	DELK	<	delete keygroup
    DELK,
    // 14h	DELS	<	delete sample header and data
    DELS,
    // 15h	SETEX	<	set S1000 exclusive channel
    SETEX,
    // 16h	REPLY	>	S1000 command reply (error or ok)
    REPLY,
    // 1Dh	CASPACK	<	corrected ASPACK
    CASPACK = 0x1D
}


class s3000xl implements Device {
    private readonly in: midi.Input;
    private readonly out: midi.Output;

    constructor(input: midi.Input, output: midi.Output) {
        this.in = input
        this.out = output
    }

    async getProgramNames(names: any[]) {
        let offset = 5
        const m = await this.send(Opcode.RPLIST, [])
        let b = m.slice(offset, offset + 2)
        offset += 2
        const programCount = bytes2numberLE(b)
        for (let i = 0; i < programCount; i++, offset += 12) {
            names.push(akaiByte2String(m.slice(offset, offset + 12)))
        }
    }

    async getSampleNames(names: any[]) {
        let offset = 5
        const m = await this.send(Opcode.RLIST, [])
        let b = m.slice(offset, offset + 2);
        offset += 2
        const sampleCount = bytes2numberLE(b)
        for (let i = 0; i < sampleCount; i++, offset += 12) {
            names.push(akaiByte2String(m.slice(offset, offset + 12)))
        }
    }

    async getProgramHeader(programNumber: number, header: ProgramHeader) {
        // See header spec: https://lakai.sourceforge.net/docs/s2800_sysex.html
        const out = newClientOutput(true, 'getProgramHeader')
        const m = await this.send(Opcode.RPDATA, byte2nibblesLE(programNumber))
        const v = {value: 0, offset: 5}
        out.log(`PNUMBER: offset: ${v.offset}`)
        header['PNUMBER'] = nextByte(m, v).value
        const headerData = m.slice(v.offset, m.length - 1)
        parseProgramHeader(headerData, 1, header)
        out.log(header)
    }

    async getKeygroupHeader(programNumber: number, keygroupNumber: number, header: KeygroupHeader) {
        const out = newClientOutput(true, 'getKeygroupHeader')
        const m = await this.send(Opcode.RKDATA, byte2nibblesLE(programNumber).concat(keygroupNumber))
        const v = {value: 0, offset: 5}
        out.log(`PNUMBER: offset: ${v.offset}`)
        header['PNUMBER'] = nextByte(m, v).value

        out.log(`KNUMBER: offset: ${v.offset}`)
        header['KNUMBER'] = m[v.offset++]
        out.log(`offset after KNUMBER: ${v.offset}`)

        const headerData = m.slice(v.offset, m.length - 1)
        parseKeygroupHeader(headerData, 0, header)
        out.log(header)
    }

    async getSampleHeader(sampleNumber: number, header: SampleHeader) {
        // See header spec: https://lakai.sourceforge.net/docs/s2800_sysex.html
        const out = newClientOutput(true, 'getSampleHeader')
        const m = await this.send(Opcode.RSDATA, byte2nibblesLE(sampleNumber))
        const v = {value: 0, offset: 5}
        out.log(`SNUMBER: offset: ${v.offset}`)
        header['SNUMBER'] = nextByte(m, v).value

        parseSampleHeader(m.slice(v.offset, m.length - 1), 0, header)
        out.log(header)
    }

    private async send(opcode: Opcode, data: number[]) {
        const input = this.in
        const output = this.out
        const message = [
            0xf0, // 00: (240) SYSEX_START
            0x47, // 01: ( 71) AKAI
            0x00, // 02: (  0) CHANNEL
            opcode,
            0x48, // 04: ( 72) DEVICE ID
        ].concat(data)
        message.push(0xf7)  // 21: (247) SYSEX_END)

        const response = new Promise((resolve) => {
            function listener(delta: number, message: midi.MidiMessage) {
                // TODO: make sure the opcode in the response message is correct
                input.removeListener('message', listener)
                resolve(message)
            }

            input.on('message', listener)
        })

        output.sendMessage(message)
        return await response
    }

}

const ALPHABET = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#', '+', '-', '.']

export function akaiByte2String(bytes: number[]) {
    let rv = ''
    for (let v of bytes) {
        rv += ALPHABET[v]
    }
    return rv

}

export function nextByte(nibbles, v: { value: number, offset: number }) {
    v.value = nibbles2byte(nibbles[v.offset], nibbles[v.offset + 1])
    v.offset += 2
    return v
}