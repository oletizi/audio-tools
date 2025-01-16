//
// GENERATED Thu Jan 16 2025 09:13:03 GMT-0800 (Pacific Standard Time). DO NOT EDIT.
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
  PLAYHI: number    // Upper limit of play range
  OSHIFT: number    // Not used
  OUTPUT: number    // Individual output routing. This parameter also controls send to effects section.
  STEREO: number    // Left and right output levels; Range: 0 to 99
  PANPOS: number    // Balance between left and right outputs; Range: -50 to +50
  PRLOUD: number    // Basic loudness of this program; Range: 0 to 99
  V_LOUD: number    // Note-on velocity dependence of loudness; Range: -50 to +50
  K_LOUD: number    // Not used
  P_LOUD: number    // Not used
  PANRAT: number    // Speed of LFO2; 0 to 99
  PANDEP: number    // Depth of LFO2
  PANDEL: number    // Delay in growth of LFO2
  K_PANP: number    // Not used
  LFORAT: number    // Speed of LFO1
  LFODEP: number    // Depth of LFO1
  LFODEL: number    // Delay in growth of LFO1
  MWLDEP: number    // Amount of control of LFO1 depth by Modwheel
  PRSDEP: number    // Amount of control of LFO1 depth by Aftertouch
  VELDEP: number    // Amount of control of LFO1 depth by Note-On velocity
  B_PTCH: number    // Range of increase of Pitch by bendwheel
  P_PTCH: number    // Amount of control of Pitch by Pressure
  KXFADE: number    // Keygroup crossfade enable
  GROUPS: number    // Number of keygroups. To change the number of keygroups in a program, the KDATA and DELK commands should be used.
  TPNUM: number    // Temporary program number (internal use)
  TEMPER: string    // Key temperament C, C#, D, D# etc.
  ECHOUT: number    // Not used
  MW_PAN: number    // Not used
  COHERE: number    // Not used
  DESYNC: number    // Enable de-synchronisation of LFO1 across notes;  0 represents OFF, 1 represents ON
  PLAW: number    // Not used
  VASSOQ: number    // Criterion by which voices are stolen; 0 represents OLDEST, 1 represents QUIETEST
  SPLOUD: number    // Reduction in loudness due to soft pedal
  SPATT: number    // Stretch of attack due to soft pedal
  SPFILT: number    // Reduction of filter frequency due to soft pedal
  PTUNO: number    // Tuning offset of program; -50.00 to +50.00 (fraction is binary)
  K_LRAT: number    // Not used
  K_LDEP: number    // Not used
  K_LDEL: number    // Not used
  VOSCL: number    // Level sent to Individual outputs/effects
  VSSCL: number    // Not used
  LEGATO: number    // Mono legato mode enable; 0 represents OFF, 1 represents ON
  B_PTCHD: number    // Range of decrease of Pitch by bendwheel
  B_MODE: number    // Bending of held notes; 0 represents NORMAL mode, 1 represents HELD mode
  TRANSPOSE: number    // Shift pitch of incoming MIDI
  MODSPAN1: number    // First source of assignable modulation of pan position
  MODSPAN2: number    // Second source of assignable modulation of pan
  MODSPAN3: number    // Third source of assignable modulation of pan
  MODSAMP1: number    // First source of assignable modulation of loudness
  MODSAMP2: number    // Second source of assignable modulation of loudness
  MODSLFOT: number    // Source of assignable modulation of LFO1 speed
  MODSLFOL: number    // Source of assignable modulation of LFO1 depth
  MODSLFOD: number    // Source of assignable modulation of LFO1 delay
  MODSFILT1: number    // First source of assignable modulation of filter frequency
  MODSFILT2: number    // Second source of assignable modulation of filter frequency
  MODSFILT3: number    // Third source of assignable modulation of filter frequency
  MODSPITCH: number    // Source of assignable modulation of pitch
  MODSAMP3: number    // Third source of assignable modulation of loudness
  MODVPAN1: number    // Amount of control of pan by assignable source 1
  MODVPAN2: number    // Amount of control of pan by assignable source 2
  MODVPAN3: number    // Amount of control of pan by assignable source 3
  MODVAMP1: number    // Amount of control of loudness by assignable source 1
  MODVAMP2: number    // Amount of control of loudness by assignable source 2
  MODVLFOR: number    // Amount of control of LFO1 speed
  MODVLVOL: number    // Amount of control of LFO1 depth
  MODVLFOD: number    // Amount of control of LFO1 delay
  LFO1WAVE: number    // LFO1 waveform; 0 represents Triangle, 1 represents Sawtooth, 2 represents Square
  LFO2WAVE: number    // LFO2 waveform
  MODSLFLT2_1: number    // First source of assignable modulation of filter 2 frequency (only used on S3200).
  MODSLFLT2_2: number    // Second source of assignable modulation of filter 2 frequency (only used on S3200).
  MODSLFLT2_3: number    // Third source of assignable modulation of filter 2 frequency (only used on S3200).
  LFO2TRIG: number    // Retrigger mode for LFO2
  RESERVED_1: number    // Not used
  PORTIME: number    // PORTAMENTO TIME
  PORTYPE: number    // PORTAMENTO TYPE
  PORTEN: number    // PORTAMENTO ON/OFF
  PFXCHAN: number    // Effects Bus Select; 0 to 4
}

export function parseProgramHeader(data: number[], offset: number, o: ProgramHeader) {
    const out = newClientOutput(true, 'parseProgramHeader')
    const v = {value: 0, offset: offset * 2}

    let b: number[]
    function reloff() {
        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking. See https://lakai.sourceforge.net/docs/s2800_sysex.html
        // As such, The math here is weird: 
        // * Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--hence v.offset /2 
        return (v.offset / 2)
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
          out.log('PRNAME at ' + i + ': ' + o.PRNAME)    }

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

    // Upper limit of play range
    out.log('PLAYHI: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PLAYHI = bytes2numberLE(b)

    // Not used
    out.log('OSHIFT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.OSHIFT = bytes2numberLE(b)

    // Individual output routing. This parameter also controls send to effects section.
    out.log('OUTPUT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.OUTPUT = bytes2numberLE(b)

    // Left and right output levels; Range: 0 to 99
    out.log('STEREO: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.STEREO = bytes2numberLE(b)

    // Balance between left and right outputs; Range: -50 to +50
    out.log('PANPOS: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PANPOS = bytes2numberLE(b)

    // Basic loudness of this program; Range: 0 to 99
    out.log('PRLOUD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PRLOUD = bytes2numberLE(b)

    // Note-on velocity dependence of loudness; Range: -50 to +50
    out.log('V_LOUD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_LOUD = bytes2numberLE(b)

    // Not used
    out.log('K_LOUD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_LOUD = bytes2numberLE(b)

    // Not used
    out.log('P_LOUD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.P_LOUD = bytes2numberLE(b)

    // Speed of LFO2; 0 to 99
    out.log('PANRAT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PANRAT = bytes2numberLE(b)

    // Depth of LFO2
    out.log('PANDEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PANDEP = bytes2numberLE(b)

    // Delay in growth of LFO2
    out.log('PANDEL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PANDEL = bytes2numberLE(b)

    // Not used
    out.log('K_PANP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_PANP = bytes2numberLE(b)

    // Speed of LFO1
    out.log('LFORAT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFORAT = bytes2numberLE(b)

    // Depth of LFO1
    out.log('LFODEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFODEP = bytes2numberLE(b)

    // Delay in growth of LFO1
    out.log('LFODEL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFODEL = bytes2numberLE(b)

    // Amount of control of LFO1 depth by Modwheel
    out.log('MWLDEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MWLDEP = bytes2numberLE(b)

    // Amount of control of LFO1 depth by Aftertouch
    out.log('PRSDEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PRSDEP = bytes2numberLE(b)

    // Amount of control of LFO1 depth by Note-On velocity
    out.log('VELDEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VELDEP = bytes2numberLE(b)

    // Range of increase of Pitch by bendwheel
    out.log('B_PTCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.B_PTCH = bytes2numberLE(b)

    // Amount of control of Pitch by Pressure
    out.log('P_PTCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.P_PTCH = bytes2numberLE(b)

    // Keygroup crossfade enable
    out.log('KXFADE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KXFADE = bytes2numberLE(b)

    // Number of keygroups. To change the number of keygroups in a program, the KDATA and DELK commands should be used.
    out.log('GROUPS: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.GROUPS = bytes2numberLE(b)

    // Temporary program number (internal use)
    out.log('TPNUM: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.TPNUM = bytes2numberLE(b)

    // Key temperament C, C#, D, D# etc.
    out.log('TEMPER: offset: ' + reloff())
    o.TEMPER = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.TEMPER += akaiByte2String([v.value])
          out.log('TEMPER at ' + i + ': ' + o.TEMPER)    }

    // Not used
    out.log('ECHOUT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ECHOUT = bytes2numberLE(b)

    // Not used
    out.log('MW_PAN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MW_PAN = bytes2numberLE(b)

    // Not used
    out.log('COHERE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.COHERE = bytes2numberLE(b)

    // Enable de-synchronisation of LFO1 across notes;  0 represents OFF, 1 represents ON
    out.log('DESYNC: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.DESYNC = bytes2numberLE(b)

    // Not used
    out.log('PLAW: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PLAW = bytes2numberLE(b)

    // Criterion by which voices are stolen; 0 represents OLDEST, 1 represents QUIETEST
    out.log('VASSOQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VASSOQ = bytes2numberLE(b)

    // Reduction in loudness due to soft pedal
    out.log('SPLOUD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SPLOUD = bytes2numberLE(b)

    // Stretch of attack due to soft pedal
    out.log('SPATT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SPATT = bytes2numberLE(b)

    // Reduction of filter frequency due to soft pedal
    out.log('SPFILT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SPFILT = bytes2numberLE(b)

    // Tuning offset of program; -50.00 to +50.00 (fraction is binary)
    out.log('PTUNO: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PTUNO = bytes2numberLE(b)

    // Not used
    out.log('K_LRAT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_LRAT = bytes2numberLE(b)

    // Not used
    out.log('K_LDEP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_LDEP = bytes2numberLE(b)

    // Not used
    out.log('K_LDEL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_LDEL = bytes2numberLE(b)

    // Level sent to Individual outputs/effects
    out.log('VOSCL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VOSCL = bytes2numberLE(b)

    // Not used
    out.log('VSSCL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VSSCL = bytes2numberLE(b)

    // Mono legato mode enable; 0 represents OFF, 1 represents ON
    out.log('LEGATO: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LEGATO = bytes2numberLE(b)

    // Range of decrease of Pitch by bendwheel
    out.log('B_PTCHD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.B_PTCHD = bytes2numberLE(b)

    // Bending of held notes; 0 represents NORMAL mode, 1 represents HELD mode
    out.log('B_MODE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.B_MODE = bytes2numberLE(b)

    // Shift pitch of incoming MIDI
    out.log('TRANSPOSE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.TRANSPOSE = bytes2numberLE(b)

    // First source of assignable modulation of pan position
    out.log('MODSPAN1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSPAN1 = bytes2numberLE(b)

    // Second source of assignable modulation of pan
    out.log('MODSPAN2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSPAN2 = bytes2numberLE(b)

    // Third source of assignable modulation of pan
    out.log('MODSPAN3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSPAN3 = bytes2numberLE(b)

    // First source of assignable modulation of loudness
    out.log('MODSAMP1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSAMP1 = bytes2numberLE(b)

    // Second source of assignable modulation of loudness
    out.log('MODSAMP2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSAMP2 = bytes2numberLE(b)

    // Source of assignable modulation of LFO1 speed
    out.log('MODSLFOT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFOT = bytes2numberLE(b)

    // Source of assignable modulation of LFO1 depth
    out.log('MODSLFOL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFOL = bytes2numberLE(b)

    // Source of assignable modulation of LFO1 delay
    out.log('MODSLFOD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFOD = bytes2numberLE(b)

    // First source of assignable modulation of filter frequency
    out.log('MODSFILT1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSFILT1 = bytes2numberLE(b)

    // Second source of assignable modulation of filter frequency
    out.log('MODSFILT2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSFILT2 = bytes2numberLE(b)

    // Third source of assignable modulation of filter frequency
    out.log('MODSFILT3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSFILT3 = bytes2numberLE(b)

    // Source of assignable modulation of pitch
    out.log('MODSPITCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSPITCH = bytes2numberLE(b)

    // Third source of assignable modulation of loudness
    out.log('MODSAMP3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSAMP3 = bytes2numberLE(b)

    // Amount of control of pan by assignable source 1
    out.log('MODVPAN1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVPAN1 = bytes2numberLE(b)

    // Amount of control of pan by assignable source 2
    out.log('MODVPAN2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVPAN2 = bytes2numberLE(b)

    // Amount of control of pan by assignable source 3
    out.log('MODVPAN3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVPAN3 = bytes2numberLE(b)

    // Amount of control of loudness by assignable source 1
    out.log('MODVAMP1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVAMP1 = bytes2numberLE(b)

    // Amount of control of loudness by assignable source 2
    out.log('MODVAMP2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVAMP2 = bytes2numberLE(b)

    // Amount of control of LFO1 speed
    out.log('MODVLFOR: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVLFOR = bytes2numberLE(b)

    // Amount of control of LFO1 depth
    out.log('MODVLVOL: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVLVOL = bytes2numberLE(b)

    // Amount of control of LFO1 delay
    out.log('MODVLFOD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVLFOD = bytes2numberLE(b)

    // LFO1 waveform; 0 represents Triangle, 1 represents Sawtooth, 2 represents Square
    out.log('LFO1WAVE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFO1WAVE = bytes2numberLE(b)

    // LFO2 waveform
    out.log('LFO2WAVE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFO2WAVE = bytes2numberLE(b)

    // First source of assignable modulation of filter 2 frequency (only used on S3200).
    out.log('MODSLFLT2_1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFLT2_1 = bytes2numberLE(b)

    // Second source of assignable modulation of filter 2 frequency (only used on S3200).
    out.log('MODSLFLT2_2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFLT2_2 = bytes2numberLE(b)

    // Third source of assignable modulation of filter 2 frequency (only used on S3200).
    out.log('MODSLFLT2_3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODSLFLT2_3 = bytes2numberLE(b)

    // Retrigger mode for LFO2
    out.log('LFO2TRIG: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LFO2TRIG = bytes2numberLE(b)

    // Not used
    out.log('RESERVED_1: offset: ' + reloff())
    b = []
    for (let i=0; i<7; i++) {
        b.push(nextByte(data, v).value)
    }
    o.RESERVED_1 = bytes2numberLE(b)

    // PORTAMENTO TIME
    out.log('PORTIME: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PORTIME = bytes2numberLE(b)

    // PORTAMENTO TYPE
    out.log('PORTYPE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PORTYPE = bytes2numberLE(b)

    // PORTAMENTO ON/OFF
    out.log('PORTEN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PORTEN = bytes2numberLE(b)

    // Effects Bus Select; 0 to 4
    out.log('PFXCHAN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PFXCHAN = bytes2numberLE(b)

}

export interface SampleHeader {
  SHIDENT: number    // Block identifier; Range: 3 (Fixed)
  SBANDW: number    // Sample bandwidth; Range: 0 represents 10kHz, 1 represents 20kHz
  SPITCH: number    // Original pitch; Range: 21 to 127 represents A1 to G8
  SHNAME: string    // Sample name
  SSRVLD: number    // Sample rate validity; 0 indicates rate is invalid, 128 indicates rate is valid
  SLOOPS: number    // Number of loops
  SALOOP: number    // First active loop (internal use)
  SHLOOP: number    // Highest loop (internal use)
  SPTYPE: number    // Playback type; 0 = Normal looping, 1 = Loop until release, 2 = No looping, 3 = Play to sample end
  STUNO: number    // Sample tuning offset cent:semi
  SLOCAT: number    // Absolute start address in memory of sample
  SLNGTH: number    // Length of sample
  SSTART: number    // Offset from start of sample from which playback commences
  SMPEND: number    // Offset from start of sample from which playback ceases
  LOOPAT1: number    // Position in sample of first loop point
  LLNGTH1: number    // First loop length
  LDWELL1: number    // Dwell time of first loop; Range: 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
  LOOPAT2: number    // Position in sample of second loop point
  LLNGTH2: number    // Second loop length
  LDWELL2: number    // Dwell time of second loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
  LOOPAT3: number    // Position in sample of third loop point
  LLNGTH3: number    // Third loop length
  LDWELL3: number    // Dwell time of third loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
  LOOPAT4: number    // Position in sample of fourth loop point
  LLNGTH4: number    // Fourth loop length
  LDWELL4: number    // Dwell time of fourth loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
  SLXY1: number    // Relative loop factors for loop 1
}

export function parseSampleHeader(data: number[], offset: number, o: SampleHeader) {
    const out = newClientOutput(true, 'parseSampleHeader')
    const v = {value: 0, offset: offset * 2}

    let b: number[]
    function reloff() {
        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking. See https://lakai.sourceforge.net/docs/s2800_sysex.html
        // As such, The math here is weird: 
        // * Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--hence v.offset /2 
        return (v.offset / 2)
    }

    // Block identifier; Range: 3 (Fixed)
    out.log('SHIDENT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SHIDENT = bytes2numberLE(b)

    // Sample bandwidth; Range: 0 represents 10kHz, 1 represents 20kHz
    out.log('SBANDW: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SBANDW = bytes2numberLE(b)

    // Original pitch; Range: 21 to 127 represents A1 to G8
    out.log('SPITCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SPITCH = bytes2numberLE(b)

    // Sample name
    out.log('SHNAME: offset: ' + reloff())
    o.SHNAME = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.SHNAME += akaiByte2String([v.value])
          out.log('SHNAME at ' + i + ': ' + o.SHNAME)    }

    // Sample rate validity; 0 indicates rate is invalid, 128 indicates rate is valid
    out.log('SSRVLD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SSRVLD = bytes2numberLE(b)

    // Number of loops
    out.log('SLOOPS: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLOOPS = bytes2numberLE(b)

    // First active loop (internal use)
    out.log('SALOOP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SALOOP = bytes2numberLE(b)

    // Highest loop (internal use)
    out.log('SHLOOP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SHLOOP = bytes2numberLE(b)

    // Playback type; 0 = Normal looping, 1 = Loop until release, 2 = No looping, 3 = Play to sample end
    out.log('SPTYPE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SPTYPE = bytes2numberLE(b)

    // Sample tuning offset cent:semi
    out.log('STUNO: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.STUNO = bytes2numberLE(b)

    // Absolute start address in memory of sample
    out.log('SLOCAT: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLOCAT = bytes2numberLE(b)

    // Length of sample
    out.log('SLNGTH: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLNGTH = bytes2numberLE(b)

    // Offset from start of sample from which playback commences
    out.log('SSTART: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SSTART = bytes2numberLE(b)

    // Offset from start of sample from which playback ceases
    out.log('SMPEND: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SMPEND = bytes2numberLE(b)

    // Position in sample of first loop point
    out.log('LOOPAT1: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOOPAT1 = bytes2numberLE(b)

    // First loop length
    out.log('LLNGTH1: offset: ' + reloff())
    b = []
    for (let i=0; i<6; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LLNGTH1 = bytes2numberLE(b)

    // Dwell time of first loop; Range: 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
    out.log('LDWELL1: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LDWELL1 = bytes2numberLE(b)

    // Position in sample of second loop point
    out.log('LOOPAT2: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOOPAT2 = bytes2numberLE(b)

    // Second loop length
    out.log('LLNGTH2: offset: ' + reloff())
    b = []
    for (let i=0; i<6; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LLNGTH2 = bytes2numberLE(b)

    // Dwell time of second loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
    out.log('LDWELL2: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LDWELL2 = bytes2numberLE(b)

    // Position in sample of third loop point
    out.log('LOOPAT3: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOOPAT3 = bytes2numberLE(b)

    // Third loop length
    out.log('LLNGTH3: offset: ' + reloff())
    b = []
    for (let i=0; i<6; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LLNGTH3 = bytes2numberLE(b)

    // Dwell time of third loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
    out.log('LDWELL3: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LDWELL3 = bytes2numberLE(b)

    // Position in sample of fourth loop point
    out.log('LOOPAT4: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOOPAT4 = bytes2numberLE(b)

    // Fourth loop length
    out.log('LLNGTH4: offset: ' + reloff())
    b = []
    for (let i=0; i<6; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LLNGTH4 = bytes2numberLE(b)

    // Dwell time of fourth loop; 0 represents No Loop, 9999 = Hold, 1 to 9998 represents Dwell time in milliseconds
    out.log('LDWELL4: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LDWELL4 = bytes2numberLE(b)

    // Relative loop factors for loop 1
    out.log('SLXY1: offset: ' + reloff())
    b = []
    for (let i=0; i<4; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLXY1 = bytes2numberLE(b)

}

