//
// GENERATED Wed Jan 15 2025 22:49:11 GMT-0800 (Pacific Standard Time). DO NOT EDIT.
//    
import {byte2nibblesLE, bytes2numberLE, nibbles2byte} from "@/lib/lib-core"
import {newClientOutput} from "@/lib/process-output"
import {nextByte, akaiByte2String} from "@/midi/akai-s3000xl"
    
export interface ProgramHeader {
  KGRP1: number    // Block address of first keygroup (internal use)
  PRNAME: string    // Name of program
  PRGNUM: number    // MIDI program number; Range: 0 to 128; After sending data to this parameter, Miscellaneous function BTSORT should be triggered to resort the list of programs into order and to flag active programs.
  PMCHAN: number    // MIDI channel; Range: 255 signifies OMNI, 0 to 15 indicate MIDI channel
  POLYPH: number    // Depth of polyphony; Range: 0 to 31 (these represent polyphony values of 1 to 32)
  PRIORT: number    // Priority of voices playing this program; Range: 0=low, 1=norm, 2=high, 3=hold
  PLAYLO: number    // Lower limit of play range; Range: 21 to 127 represents A1 to G8
}

export function parseProgramHeader(data: number[], o: ProgramHeader) {
    const out = newClientOutput(true, 'parseProgramHeader')
    const v = {value: 0, offset: 0}

    let b: number[]
    function reloff() {
        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking.        // Math here is weird. It's to agree with offsets in Akai sysex docs: https://lakai.sourceforge.net/docs/s2800_sysex.html
        // Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--
        // hence v.offset /2 . And, the offsets start counting at 1, hence +1.
        return (v.offset / 2) + 1
    }

    // Block address of first keygroup (internal use)
    out.log('KGRP1: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KGRP1 = bytes2numberLE(b)

    // Name of program
    out.log('PRNAME: offset: ' + reloff())
    o.PRNAME = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.PRNAME += akaiByte2String([v.value])
    }

    // MIDI program number; Range: 0 to 128; After sending data to this parameter, Miscellaneous function BTSORT should be triggered to resort the list of programs into order and to flag active programs.
    out.log('PRGNUM: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PRGNUM = bytes2numberLE(b)

    // MIDI channel; Range: 255 signifies OMNI, 0 to 15 indicate MIDI channel
    out.log('PMCHAN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PMCHAN = bytes2numberLE(b)

    // Depth of polyphony; Range: 0 to 31 (these represent polyphony values of 1 to 32)
    out.log('POLYPH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.POLYPH = bytes2numberLE(b)

    // Priority of voices playing this program; Range: 0=low, 1=norm, 2=high, 3=hold
    out.log('PRIORT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PRIORT = bytes2numberLE(b)

    // Lower limit of play range; Range: 21 to 127 represents A1 to G8
    out.log('PLAYLO: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PLAYLO = bytes2numberLE(b)

}