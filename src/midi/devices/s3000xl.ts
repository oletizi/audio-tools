//
// GENERATED Wed Jan 15 2025 22:23:42 GMT-0800 (Pacific Standard Time). DO NOT EDIT.
//    
import {byte2nibblesLE, bytes2numberLE, nibbles2byte} from "@/lib/lib-core"
import {newClientOutput} from "@/lib/process-output"
import {nextByte, akaiByte2String} from "@/midi/akai-s3000xl"
    
export interface ProgramHeader {
  KGRP1: number    // Block address of first keygroup (internal use)
  PRNAME: string    // Name of program
  PRGNUM: number    // MIDI program number
  PMCHAN: number    // MIDI channel
}

export function parseProgramHeader(data: number[], o: ProgramHeader) {
    const out = newClientOutput(true, 'parseProgramHeader')
    const v = {value: 0, offset: 0}

    let b: number[]
    // Block address of first keygroup (internal use)
    out.log('KGRP1: offset: ' + v.offset)
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KGRP1 = bytes2numberLE(b)

    // Name of program
    out.log('PRNAME: offset: ' + v.offset)
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.PRNAME += akaiByte2String([v.value])
    }

    // MIDI program number
    out.log('PRGNUM: offset: ' + v.offset)
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PRGNUM = bytes2numberLE(b)

    // MIDI channel
    out.log('PMCHAN: offset: ' + v.offset)
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PMCHAN = bytes2numberLE(b)

}