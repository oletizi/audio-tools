//
// GENERATED Thu Jan 16 2025 11:26:54 GMT-0800 (Pacific Standard Time). DO NOT EDIT.
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
  SLXY2: number    // Relative loop factors for loop 2
  SLXY3: number    // Relative loop factors for loop 3
  SLXY4: number    // Relative loop factors for loop 4
  SSPARE: number    // Used internally
  SWCOMM: number    // Not used
  SSPAIR: number    // Address of stereo partner (internal use)
  SSRATE: number    // Sample rate
  SHLTO: number    // Tuning offset of hold loop; Range: -50 to +50
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
    for (let i=0; i<12; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLXY1 = bytes2numberLE(b)

    // Relative loop factors for loop 2
    out.log('SLXY2: offset: ' + reloff())
    b = []
    for (let i=0; i<12; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLXY2 = bytes2numberLE(b)

    // Relative loop factors for loop 3
    out.log('SLXY3: offset: ' + reloff())
    b = []
    for (let i=0; i<12; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLXY3 = bytes2numberLE(b)

    // Relative loop factors for loop 4
    out.log('SLXY4: offset: ' + reloff())
    b = []
    for (let i=0; i<12; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SLXY4 = bytes2numberLE(b)

    // Used internally
    out.log('SSPARE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SSPARE = bytes2numberLE(b)

    // Not used
    out.log('SWCOMM: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SWCOMM = bytes2numberLE(b)

    // Address of stereo partner (internal use)
    out.log('SSPAIR: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SSPAIR = bytes2numberLE(b)

    // Sample rate
    out.log('SSRATE: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SSRATE = bytes2numberLE(b)

    // Tuning offset of hold loop; Range: -50 to +50
    out.log('SHLTO: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SHLTO = bytes2numberLE(b)

}

export interface KeygroupHeader {
  KGIDENT: number    // Block identifier (internal use); Should equal 2
  NXTKG: number    // Next keygroup block address (internal use)
  LONOTE: number    // Lower limit of keyrange; Range: 21 to 127 represents A1 to G8
  HINOTE: number    // Upper limit of keyrange
  KGTUNO: number    // Keygroup tuning offset; Range: -50.00 to +50.00 (fraction is binary)
  FILFRQ: number    // Basic filter frequency; Range: 0 to 99
  K_FREQ: number    // Key follow of filter frequency
  V_FREQ: number    // Not used
  P_FREQ: number    // Note used
  E_FREQ: number    // Not used
  ATTAK1: number    // Attack rate of envelope 1; 0-99
  DECAY1: number    // Decay rate of envelope 1; 0-99
  SUSTN1: number    // Sustain level of envelope 1
  RELSE1: number    // Release rate of envelope 1
  V_ATT1: number    // Note-on velocity dependence of envelope 1 attack rate; Range: -50 to +50
  V_REL1: number    // Note-on velocity dependence of envelope 1 release rate
  O_REL1: number    // Note-off velocity dependence of envelope 1 release rate
  K_DAR1: number    // Dependence of envelope 2 decay and release rates on key
  ENV2R1: number    // Attack rate of envelope 2: 0-99
  ENV2R3: number    // Decay rate of envelope 2
  ENV2L3: number    // Sustain level of envelope 2
  ENV2R4: number    // Release rate of envelope 2
  V_ATT2: number    // Dependence of envelope 2 attack on note-on velocity; Range: -50 to 50
  V_REL2: number    // Dependence of envelope 2 release on note-on velocity
  O_REL2: number    // Dependence of envelope 2 release on note-off velocity
  K_DAR2: number    // Dependence of envelope 2 decay and release rates on key
  V_ENV2: number    // Scaling of envelope 2 by note-on velocity
  E_PTCH: number    // Not used
  VXFADE: number    // Velocity zone crossfade; Range: 0 represents OFF, 1 represents ON
  VZONES: number    // Not used
  LKXF: number    // Calculated left keygroup crossfade factor (internal)
  RKXF: number    // Calculated right keygroup crossfade factor (internal)
  SNAME1: string    // Sample name used in velocity zone 1
  LOVEL1: number    // Lower limit of velocity range; 0-127
  HIVEL1: number    // Upper limit of velocity range
  VTUNO1: number    // Velocity zone 1 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
  VLOUD1: number    // Velocity zone 1 loudness offset; Range: -50 to +50
  VFREQ1: number    // Velocity zone 1 filter frequency offset
  VPANO1: number    // Velocity zone 1 pan offset
  ZPLAY1: number    // Type of sample playback in velocity zone 1; 0 = As sample, 1 = Loop in release, 2 = Loop til release, 3 = No loops, 4 = Play to sample end
  LVXF1: number    // Low velocity crossfade factor (internal use)
  HVXF1: number    // High velocity crossfade factor (internal use)
  SBADD1: number    // Calculated sample header block address (internal)
  SNAME2: string    // Sample name used in velocity zone 2
  LOVEL2: number    // Lower limit of velocity range 2
  HIVEL2: number    // Upper limit of velocity range 2
  VTUNO2: number    // Velocity zone 2 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
  VLOUD2: number    // Velocity zone 2 loudness offset
  VFREQ2: number    // Velocity zone 2 filter frequency offset
  VPANO2: number    // Velocity zone 2 pan offset
  ZPLAY2: number    // Type of sample playback in velocity zone 2; see ZPLAY1
  LVXF2: number    // Low velocity crossfade factor (internal use)
  HVXF2: number    // High velocity crossfade factor (internal use)
  SBADD2: number    // Calculated sample header block address (internal)
  SNAME3: string    // Sample name used in velocity zone 3
  LOVEL3: number    // Lower limit of velocity range 3
  HIVEL3: number    // Upper limit of velocity range 3
  VTUNO3: number    // Velocity zone 3 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
  VLOUD3: number    // Velocity zone 3 loudness offset; -50 to +50
  VFREQ3: number    // Velocity zone 3 filter frequency offset
  VPANO3: number    // Velocity zone 3 pan offset
  ZPLAY3: number    // Type of sample playback in velocity zone 3; See ZPLAY1
  LVXF3: number    // Low velocity crossfade factor (internal use)
  HVXF3: number    // High velocity crossfade factor (internal use)
  SBADD3: number    // Calculated sample header block address (internal)
  SNAME4: string    // Sample name used in velocity zone 4
  LOVEL4: number    // Lower limit of velocity range 4
  HIVEL4: number    // Upper limit of velocity range 4
  VTUNO4: number    // Velocity zone 4 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
  VLOUD4: number    // Velocity zone 4 loudness offset
  VFREQ4: number    // Velocity zone 4 filter frequency offset
  VPANO4: number    // Velocity zone 4 pan offset
  ZPLAY4: number    // Type of sample playback in velocity zone 4; See ZPLAY1
  LVXF4: number    // Low velocity crossfade factor (internal use)
  HVXF4: number    // High velocity crossfade factor (internal use)
  SBADD4: number    // Calculated sample header block address (internal)
  KBEAT: number    // Fixed rate detune; -50 to 50
  AHOLD: number    // Remain in attack phase until first loop encountered; Range: 0 represents OFF, 1 represents ON
  CP1: number    // Constant pitch flag for velocity zone 1; 0 represents TRACK, 1 represents CONST
  CP2: number    // Constant pitch flag for velocity zone 2
  CP3: number    // Constant pitch flag for velocity zone 3
  CP4: number    // Constant pitch flag for velocity zone 4
  VZOUT1: number    // Individual output offset for velocity zone 1
  VZOUT2: number    // Individual output offset for velocity zone 2
  VZOUT3: number    // Individual output offset for velocity zone 3
  VZOUT4: number    // Individual output offset for velocity zone 4
  VSS1: number    // Start point dependence on note-on velocity for sample in velocity zone 1; Range: -9999 to +9999 data points
  VSS2: number    // Start point dependence on note-on velocity for sample in velocity zone 2
  VSS3: number    // Start point dependence on note-on velocity for sample in velocity zone 3
  VSS4: number    // Start point dependence on note-on velocity for sample in velocity zone 4
  KV_LO: number    // Not used
  FILQ: number    // Resonance of filter 1; Range: 0 to 15
  L_PTCH: number    // Amount of control of pitch by LFO1; -50 to +50
  MODVFILT1: number    // Amount of control of filter frequency by assignable source 1
  MODVFILT2: number    // Amount of control of filter frequency by assignable source 2
  MODVFILT3: number    // Amount of control of filter frequency by assignable source 3
  MODVPITCH: number    // Amount of control of pitch by assignable source
  MODVAMP3: number    // Amount of control of loudness by assignable keygroup source
  ENV2L1: number    // Level of envelope 2 at end attack phase (phase 1); 0-99
  ENV2R2: number    // Rate during phase 2 of envelope 2
  ENV2L2: number    // Level of envelope 2 at end of phase 1
  ENV2L4: number    // Final envelope 2 level
  KGMUTE: number    // Keygroup mute group; Range: 0ffh = off, mute groups 0 to 31
  PFXCHAN: number    // Effects bus select
  PFXSLEV: number    // Effects send level
  Reserved_1: number    // Not used
  LSI2_ON: number    // Route audio through second LSI; Range: 0 = -6dB, 1 = 0dB
  FLT2GAIN: number    // Make-up gain of second filter; Range: 0 = -6dB, 1 = 0dB
  FLT2MODE: number    // Mode of second filter; Range: 0 = Low-pass, 1 = Band-pass, 2 = High-pass, 3 = EQ
  FLT2Q: number    // Resonance of second filter; Range: 0 to 31
  TONEFREQ: number    // Center frequency of tone section
  TONESLOP: number    // Slope of tone section
  MODVFLT2_1: number    // Amount of control of second filter frequency by source 1
  MODVFLT2_2: number    // Amount of control of second filter frequency by source 2
  MODVFLT2_3: number    // Amount of control of second filter frequency by source 3
  FIL2FR: number    // Basic second filter frequency; 0-99
  K_FRQ2: number    // Second filter key follow; Range: -24 to +24 semitones
  ATTAK3: number    // Attack rate of envelope 3
  ENV3L1: number    // Final level of attack phase (phase 1) of envelope 3
  ENV3R2: number    // Rate of phase 2 of envelope 3
  ENV3L2: number    // Final level of phase 2 of envelope 3
  ENV3R3: number    // Rate of phase 3 of envelope 3
  ENV3L3: number    // Final level of phase 3 of envelope 3
  ENV3R4: number    // Rate of release phase (phase 4) of envelope 3
  ENV3L4: number    // Final target level of envelope 3
  V_ATT3: number    // Dependence of envelope 3 attack rate on note-on velocity
  V_REL3: number    // Dependence of envelope 3 release rate on note-on velocity
  O_REL3: number    // Dependence of envelope 3 release rate on note-off velocity
  K_DAR3: number    // Dependence of envelope 3 release and decay rate on key
  V_ENV3: number    // Scaling of envelope 3 by note-on velocity
  KFXCHAN: number    // Keygroup override Effects Bus select; Range: 0 to 5
  KFXSLEV: number    // Keygroup override Effects Send level; Range: 0 to 99
}

export function parseKeygroupHeader(data: number[], offset: number, o: KeygroupHeader) {
    const out = newClientOutput(true, 'parseKeygroupHeader')
    const v = {value: 0, offset: offset * 2}

    let b: number[]
    function reloff() {
        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking. See https://lakai.sourceforge.net/docs/s2800_sysex.html
        // As such, The math here is weird: 
        // * Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--hence v.offset /2 
        return (v.offset / 2)
    }

    // Block identifier (internal use); Should equal 2
    out.log('KGIDENT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KGIDENT = bytes2numberLE(b)

    // Next keygroup block address (internal use)
    out.log('NXTKG: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.NXTKG = bytes2numberLE(b)

    // Lower limit of keyrange; Range: 21 to 127 represents A1 to G8
    out.log('LONOTE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LONOTE = bytes2numberLE(b)

    // Upper limit of keyrange
    out.log('HINOTE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HINOTE = bytes2numberLE(b)

    // Keygroup tuning offset; Range: -50.00 to +50.00 (fraction is binary)
    out.log('KGTUNO: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KGTUNO = bytes2numberLE(b)

    // Basic filter frequency; Range: 0 to 99
    out.log('FILFRQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FILFRQ = bytes2numberLE(b)

    // Key follow of filter frequency
    out.log('K_FREQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_FREQ = bytes2numberLE(b)

    // Not used
    out.log('V_FREQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_FREQ = bytes2numberLE(b)

    // Note used
    out.log('P_FREQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.P_FREQ = bytes2numberLE(b)

    // Not used
    out.log('E_FREQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.E_FREQ = bytes2numberLE(b)

    // Attack rate of envelope 1; 0-99
    out.log('ATTAK1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ATTAK1 = bytes2numberLE(b)

    // Decay rate of envelope 1; 0-99
    out.log('DECAY1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.DECAY1 = bytes2numberLE(b)

    // Sustain level of envelope 1
    out.log('SUSTN1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SUSTN1 = bytes2numberLE(b)

    // Release rate of envelope 1
    out.log('RELSE1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.RELSE1 = bytes2numberLE(b)

    // Note-on velocity dependence of envelope 1 attack rate; Range: -50 to +50
    out.log('V_ATT1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_ATT1 = bytes2numberLE(b)

    // Note-on velocity dependence of envelope 1 release rate
    out.log('V_REL1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_REL1 = bytes2numberLE(b)

    // Note-off velocity dependence of envelope 1 release rate
    out.log('O_REL1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.O_REL1 = bytes2numberLE(b)

    // Dependence of envelope 2 decay and release rates on key
    out.log('K_DAR1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_DAR1 = bytes2numberLE(b)

    // Attack rate of envelope 2: 0-99
    out.log('ENV2R1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2R1 = bytes2numberLE(b)

    // Decay rate of envelope 2
    out.log('ENV2R3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2R3 = bytes2numberLE(b)

    // Sustain level of envelope 2
    out.log('ENV2L3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2L3 = bytes2numberLE(b)

    // Release rate of envelope 2
    out.log('ENV2R4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2R4 = bytes2numberLE(b)

    // Dependence of envelope 2 attack on note-on velocity; Range: -50 to 50
    out.log('V_ATT2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_ATT2 = bytes2numberLE(b)

    // Dependence of envelope 2 release on note-on velocity
    out.log('V_REL2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_REL2 = bytes2numberLE(b)

    // Dependence of envelope 2 release on note-off velocity
    out.log('O_REL2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.O_REL2 = bytes2numberLE(b)

    // Dependence of envelope 2 decay and release rates on key
    out.log('K_DAR2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_DAR2 = bytes2numberLE(b)

    // Scaling of envelope 2 by note-on velocity
    out.log('V_ENV2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_ENV2 = bytes2numberLE(b)

    // Not used
    out.log('E_PTCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.E_PTCH = bytes2numberLE(b)

    // Velocity zone crossfade; Range: 0 represents OFF, 1 represents ON
    out.log('VXFADE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VXFADE = bytes2numberLE(b)

    // Not used
    out.log('VZONES: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VZONES = bytes2numberLE(b)

    // Calculated left keygroup crossfade factor (internal)
    out.log('LKXF: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LKXF = bytes2numberLE(b)

    // Calculated right keygroup crossfade factor (internal)
    out.log('RKXF: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.RKXF = bytes2numberLE(b)

    // Sample name used in velocity zone 1
    out.log('SNAME1: offset: ' + reloff())
    o.SNAME1 = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.SNAME1 += akaiByte2String([v.value])
          out.log('SNAME1 at ' + i + ': ' + o.SNAME1)    }

    // Lower limit of velocity range; 0-127
    out.log('LOVEL1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOVEL1 = bytes2numberLE(b)

    // Upper limit of velocity range
    out.log('HIVEL1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HIVEL1 = bytes2numberLE(b)

    // Velocity zone 1 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
    out.log('VTUNO1: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VTUNO1 = bytes2numberLE(b)

    // Velocity zone 1 loudness offset; Range: -50 to +50
    out.log('VLOUD1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VLOUD1 = bytes2numberLE(b)

    // Velocity zone 1 filter frequency offset
    out.log('VFREQ1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VFREQ1 = bytes2numberLE(b)

    // Velocity zone 1 pan offset
    out.log('VPANO1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VPANO1 = bytes2numberLE(b)

    // Type of sample playback in velocity zone 1; 0 = As sample, 1 = Loop in release, 2 = Loop til release, 3 = No loops, 4 = Play to sample end
    out.log('ZPLAY1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ZPLAY1 = bytes2numberLE(b)

    // Low velocity crossfade factor (internal use)
    out.log('LVXF1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LVXF1 = bytes2numberLE(b)

    // High velocity crossfade factor (internal use)
    out.log('HVXF1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HVXF1 = bytes2numberLE(b)

    // Calculated sample header block address (internal)
    out.log('SBADD1: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SBADD1 = bytes2numberLE(b)

    // Sample name used in velocity zone 2
    out.log('SNAME2: offset: ' + reloff())
    o.SNAME2 = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.SNAME2 += akaiByte2String([v.value])
          out.log('SNAME2 at ' + i + ': ' + o.SNAME2)    }

    // Lower limit of velocity range 2
    out.log('LOVEL2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOVEL2 = bytes2numberLE(b)

    // Upper limit of velocity range 2
    out.log('HIVEL2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HIVEL2 = bytes2numberLE(b)

    // Velocity zone 2 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
    out.log('VTUNO2: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VTUNO2 = bytes2numberLE(b)

    // Velocity zone 2 loudness offset
    out.log('VLOUD2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VLOUD2 = bytes2numberLE(b)

    // Velocity zone 2 filter frequency offset
    out.log('VFREQ2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VFREQ2 = bytes2numberLE(b)

    // Velocity zone 2 pan offset
    out.log('VPANO2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VPANO2 = bytes2numberLE(b)

    // Type of sample playback in velocity zone 2; see ZPLAY1
    out.log('ZPLAY2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ZPLAY2 = bytes2numberLE(b)

    // Low velocity crossfade factor (internal use)
    out.log('LVXF2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LVXF2 = bytes2numberLE(b)

    // High velocity crossfade factor (internal use)
    out.log('HVXF2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HVXF2 = bytes2numberLE(b)

    // Calculated sample header block address (internal)
    out.log('SBADD2: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SBADD2 = bytes2numberLE(b)

    // Sample name used in velocity zone 3
    out.log('SNAME3: offset: ' + reloff())
    o.SNAME3 = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.SNAME3 += akaiByte2String([v.value])
          out.log('SNAME3 at ' + i + ': ' + o.SNAME3)    }

    // Lower limit of velocity range 3
    out.log('LOVEL3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOVEL3 = bytes2numberLE(b)

    // Upper limit of velocity range 3
    out.log('HIVEL3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HIVEL3 = bytes2numberLE(b)

    // Velocity zone 3 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
    out.log('VTUNO3: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VTUNO3 = bytes2numberLE(b)

    // Velocity zone 3 loudness offset; -50 to +50
    out.log('VLOUD3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VLOUD3 = bytes2numberLE(b)

    // Velocity zone 3 filter frequency offset
    out.log('VFREQ3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VFREQ3 = bytes2numberLE(b)

    // Velocity zone 3 pan offset
    out.log('VPANO3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VPANO3 = bytes2numberLE(b)

    // Type of sample playback in velocity zone 3; See ZPLAY1
    out.log('ZPLAY3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ZPLAY3 = bytes2numberLE(b)

    // Low velocity crossfade factor (internal use)
    out.log('LVXF3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LVXF3 = bytes2numberLE(b)

    // High velocity crossfade factor (internal use)
    out.log('HVXF3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HVXF3 = bytes2numberLE(b)

    // Calculated sample header block address (internal)
    out.log('SBADD3: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SBADD3 = bytes2numberLE(b)

    // Sample name used in velocity zone 4
    out.log('SNAME4: offset: ' + reloff())
    o.SNAME4 = ''
    for (let i = 0; i < 12; i++) {
          nextByte(data, v)
          o.SNAME4 += akaiByte2String([v.value])
          out.log('SNAME4 at ' + i + ': ' + o.SNAME4)    }

    // Lower limit of velocity range 4
    out.log('LOVEL4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LOVEL4 = bytes2numberLE(b)

    // Upper limit of velocity range 4
    out.log('HIVEL4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HIVEL4 = bytes2numberLE(b)

    // Velocity zone 4 tuning offset; Range: -50.00 to +50.00 (fraction is binary)
    out.log('VTUNO4: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VTUNO4 = bytes2numberLE(b)

    // Velocity zone 4 loudness offset
    out.log('VLOUD4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VLOUD4 = bytes2numberLE(b)

    // Velocity zone 4 filter frequency offset
    out.log('VFREQ4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VFREQ4 = bytes2numberLE(b)

    // Velocity zone 4 pan offset
    out.log('VPANO4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VPANO4 = bytes2numberLE(b)

    // Type of sample playback in velocity zone 4; See ZPLAY1
    out.log('ZPLAY4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ZPLAY4 = bytes2numberLE(b)

    // Low velocity crossfade factor (internal use)
    out.log('LVXF4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LVXF4 = bytes2numberLE(b)

    // High velocity crossfade factor (internal use)
    out.log('HVXF4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.HVXF4 = bytes2numberLE(b)

    // Calculated sample header block address (internal)
    out.log('SBADD4: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.SBADD4 = bytes2numberLE(b)

    // Fixed rate detune; -50 to 50
    out.log('KBEAT: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KBEAT = bytes2numberLE(b)

    // Remain in attack phase until first loop encountered; Range: 0 represents OFF, 1 represents ON
    out.log('AHOLD: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.AHOLD = bytes2numberLE(b)

    // Constant pitch flag for velocity zone 1; 0 represents TRACK, 1 represents CONST
    out.log('CP1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.CP1 = bytes2numberLE(b)

    // Constant pitch flag for velocity zone 2
    out.log('CP2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.CP2 = bytes2numberLE(b)

    // Constant pitch flag for velocity zone 3
    out.log('CP3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.CP3 = bytes2numberLE(b)

    // Constant pitch flag for velocity zone 4
    out.log('CP4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.CP4 = bytes2numberLE(b)

    // Individual output offset for velocity zone 1
    out.log('VZOUT1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VZOUT1 = bytes2numberLE(b)

    // Individual output offset for velocity zone 2
    out.log('VZOUT2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VZOUT2 = bytes2numberLE(b)

    // Individual output offset for velocity zone 3
    out.log('VZOUT3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VZOUT3 = bytes2numberLE(b)

    // Individual output offset for velocity zone 4
    out.log('VZOUT4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VZOUT4 = bytes2numberLE(b)

    // Start point dependence on note-on velocity for sample in velocity zone 1; Range: -9999 to +9999 data points
    out.log('VSS1: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VSS1 = bytes2numberLE(b)

    // Start point dependence on note-on velocity for sample in velocity zone 2
    out.log('VSS2: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VSS2 = bytes2numberLE(b)

    // Start point dependence on note-on velocity for sample in velocity zone 3
    out.log('VSS3: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VSS3 = bytes2numberLE(b)

    // Start point dependence on note-on velocity for sample in velocity zone 4
    out.log('VSS4: offset: ' + reloff())
    b = []
    for (let i=0; i<2; i++) {
        b.push(nextByte(data, v).value)
    }
    o.VSS4 = bytes2numberLE(b)

    // Not used
    out.log('KV_LO: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KV_LO = bytes2numberLE(b)

    // Resonance of filter 1; Range: 0 to 15
    out.log('FILQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FILQ = bytes2numberLE(b)

    // Amount of control of pitch by LFO1; -50 to +50
    out.log('L_PTCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.L_PTCH = bytes2numberLE(b)

    // Amount of control of filter frequency by assignable source 1
    out.log('MODVFILT1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFILT1 = bytes2numberLE(b)

    // Amount of control of filter frequency by assignable source 2
    out.log('MODVFILT2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFILT2 = bytes2numberLE(b)

    // Amount of control of filter frequency by assignable source 3
    out.log('MODVFILT3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFILT3 = bytes2numberLE(b)

    // Amount of control of pitch by assignable source
    out.log('MODVPITCH: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVPITCH = bytes2numberLE(b)

    // Amount of control of loudness by assignable keygroup source
    out.log('MODVAMP3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVAMP3 = bytes2numberLE(b)

    // Level of envelope 2 at end attack phase (phase 1); 0-99
    out.log('ENV2L1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2L1 = bytes2numberLE(b)

    // Rate during phase 2 of envelope 2
    out.log('ENV2R2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2R2 = bytes2numberLE(b)

    // Level of envelope 2 at end of phase 1
    out.log('ENV2L2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2L2 = bytes2numberLE(b)

    // Final envelope 2 level
    out.log('ENV2L4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV2L4 = bytes2numberLE(b)

    // Keygroup mute group; Range: 0ffh = off, mute groups 0 to 31
    out.log('KGMUTE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KGMUTE = bytes2numberLE(b)

    // Effects bus select
    out.log('PFXCHAN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PFXCHAN = bytes2numberLE(b)

    // Effects send level
    out.log('PFXSLEV: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.PFXSLEV = bytes2numberLE(b)

    // Not used
    out.log('Reserved_1: offset: ' + reloff())
    b = []
    for (let i=0; i<5; i++) {
        b.push(nextByte(data, v).value)
    }
    o.Reserved_1 = bytes2numberLE(b)

    // Route audio through second LSI; Range: 0 = -6dB, 1 = 0dB
    out.log('LSI2_ON: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.LSI2_ON = bytes2numberLE(b)

    // Make-up gain of second filter; Range: 0 = -6dB, 1 = 0dB
    out.log('FLT2GAIN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FLT2GAIN = bytes2numberLE(b)

    // Mode of second filter; Range: 0 = Low-pass, 1 = Band-pass, 2 = High-pass, 3 = EQ
    out.log('FLT2MODE: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FLT2MODE = bytes2numberLE(b)

    // Resonance of second filter; Range: 0 to 31
    out.log('FLT2Q: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FLT2Q = bytes2numberLE(b)

    // Center frequency of tone section
    out.log('TONEFREQ: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.TONEFREQ = bytes2numberLE(b)

    // Slope of tone section
    out.log('TONESLOP: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.TONESLOP = bytes2numberLE(b)

    // Amount of control of second filter frequency by source 1
    out.log('MODVFLT2_1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFLT2_1 = bytes2numberLE(b)

    // Amount of control of second filter frequency by source 2
    out.log('MODVFLT2_2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFLT2_2 = bytes2numberLE(b)

    // Amount of control of second filter frequency by source 3
    out.log('MODVFLT2_3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.MODVFLT2_3 = bytes2numberLE(b)

    // Basic second filter frequency; 0-99
    out.log('FIL2FR: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.FIL2FR = bytes2numberLE(b)

    // Second filter key follow; Range: -24 to +24 semitones
    out.log('K_FRQ2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_FRQ2 = bytes2numberLE(b)

    // Attack rate of envelope 3
    out.log('ATTAK3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ATTAK3 = bytes2numberLE(b)

    // Final level of attack phase (phase 1) of envelope 3
    out.log('ENV3L1: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3L1 = bytes2numberLE(b)

    // Rate of phase 2 of envelope 3
    out.log('ENV3R2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3R2 = bytes2numberLE(b)

    // Final level of phase 2 of envelope 3
    out.log('ENV3L2: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3L2 = bytes2numberLE(b)

    // Rate of phase 3 of envelope 3
    out.log('ENV3R3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3R3 = bytes2numberLE(b)

    // Final level of phase 3 of envelope 3
    out.log('ENV3L3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3L3 = bytes2numberLE(b)

    // Rate of release phase (phase 4) of envelope 3
    out.log('ENV3R4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3R4 = bytes2numberLE(b)

    // Final target level of envelope 3
    out.log('ENV3L4: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.ENV3L4 = bytes2numberLE(b)

    // Dependence of envelope 3 attack rate on note-on velocity
    out.log('V_ATT3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_ATT3 = bytes2numberLE(b)

    // Dependence of envelope 3 release rate on note-on velocity
    out.log('V_REL3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_REL3 = bytes2numberLE(b)

    // Dependence of envelope 3 release rate on note-off velocity
    out.log('O_REL3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.O_REL3 = bytes2numberLE(b)

    // Dependence of envelope 3 release and decay rate on key
    out.log('K_DAR3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.K_DAR3 = bytes2numberLE(b)

    // Scaling of envelope 3 by note-on velocity
    out.log('V_ENV3: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.V_ENV3 = bytes2numberLE(b)

    // Keygroup override Effects Bus select; Range: 0 to 5
    out.log('KFXCHAN: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KFXCHAN = bytes2numberLE(b)

    // Keygroup override Effects Send level; Range: 0 to 99
    out.log('KFXSLEV: offset: ' + reloff())
    b = []
    for (let i=0; i<1; i++) {
        b.push(nextByte(data, v).value)
    }
    o.KFXSLEV = bytes2numberLE(b)

}

