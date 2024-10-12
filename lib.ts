/**
 * Writes the data into the buffer; returns the number of bytes written
 * @param buf
 * @param data
 * @param offset
 */
function write(buf: Buffer, data: number[], offset: number): number {
    buf.set(data, offset)
    return data.length
}

/**
 * Write the number to the buffer; returns the number of bytes written
 * @param buf
 * @param n
 * @param offset
 */
function writeByte(buf: Buffer, n: number, offset: number): number {
    buf.writeInt8(n, offset)
    return 1
}

function readByte(buf, offset): number {
    return buf.readInt8(offset)
}


/**
 * Validates the buffer from offset matches the expected data array. Returns the number of bytes read
 * @param buf
 * @param data
 * @param offset
 */
function checkOrThrow(buf, data, offset) {
    for (let i = 0; i < data.length; i++, offset++) {
        if (data[i] != buf.readInt8(offset)) {
            throw new Error(`Bad vibes at: ${offset}. Expected ${data[i]} but found ${buf.readInt8(offset)}`)
        }
    }
    return data.length
}

export function bytes2Number(bytes: number[]): number {
    return Buffer.from(bytes).readInt32LE()
}

export interface Chunk {
    length: number
    name: string

    write(buf: Buffer, offset: number): number

    parse(buf: Buffer, offset: number): number
}

/**
 * Parses [offset .. offset + 8]  bytes of the buffer:
 *   - sets the chunk name to the ascii values of bytes [offset .. offset + 4]
 *   - sets the chunk length to the int32 value of bytes [offset + 5 .. offset + 8]
 *   - returns the number of bytes read
 * @param buf
 * @param chunk
 * @param offset
 */
export function parseChunkHeader(buf: Buffer, chunk: Chunk, offset: number): number {
    chunk.name = ''
    for (let i = 0; i < 4; i++, offset++) {
        chunk.name += String.fromCharCode(readByte(buf, offset))
    }
    chunk.length = buf.readInt32LE(offset)
    return 8
}

function readFromSpec(buf, obj: any, spec: string[], offset): number {
    for (let i = 0; i < spec.length; i++, offset++) {
        obj[spec[i]] = readByte(buf, offset)
    }
    return spec.length
}

function newChunkFromSpec(chunkName: number[], spec: string[]) {
    return {
        parse(buf: Buffer, offset: number): number {
            checkOrThrow(buf, chunkName, offset)
            offset += parseChunkHeader(buf, this, offset)
            readFromSpec(buf, this, spec, offset)
            return this.length + 8
        },
        write(buf: Buffer, offset: number): number {
            return 0
        }
    }
}

export interface HeaderChunk extends Chunk {
}

export function newHeaderChunk(): HeaderChunk {
    const riff = [0x52, 0x49, 0x46, 0x46] // 'RIFF'
    const chunkLength = [0x00, 0x00, 0x00, 0x00] //  Chunk length: 0 (not correct, but that's what Akai does)
    const aprg = [0x41, 0x50, 0x52, 0x47] // 'APRG'
    return {
        length: bytes2Number(chunkLength),
        name: '',
        parse(buf: Buffer, offset: number): number {
            const checkpoint = offset
            offset += checkOrThrow(buf, riff, offset)
            offset += checkOrThrow(buf, chunkLength, offset)
            offset += checkOrThrow(buf, aprg, offset)
            return offset - checkpoint
        },
        write(buf: Buffer, offset: number): number {
            const checkpoint = offset
            offset += write(buf, riff, offset)
            offset += write(buf, chunkLength, offset)
            offset += write(buf, aprg, offset)
            return offset - checkpoint
        }
    }
}


export interface ProgramChunk extends Chunk {
    programNumber: number
    keygroupCount: number
}


export function newProgramChunk(): ProgramChunk {
    const chunkName = [0x70, 0x72, 0x67, 0x20] // 'prg '
    return newChunkFromSpec(chunkName, ["pad1", "programNumber", "keygroupCount", "pad2", "pad3", "pad4"]) as ProgramChunk
}

export interface OutputChunk extends Chunk {
    loudness: number
    ampMod1: number
    panMod3: number
    panMod1: number
    ampMod2: number
    panMod2: number
    velocitySensitivity: number
}

const outputSpec = ['pad1', 'loudness', 'ampMod1', 'ampMod2', 'panMod1', 'panMod2', 'panMod3', 'velocitySensitivity']

export function newOutputChunk(): OutputChunk {
    const chunkName = [0x6f, 0x75, 0x74, 0x20]   // 'out '
    return newChunkFromSpec(chunkName, outputSpec) as OutputChunk
}

export interface TuneChunk extends Chunk {
    semiToneTune: number
    fineTune: number
    detuneC: number
    detuneCSharp: number
    detuneD: number
    detuneEFlat: number
    detuneE: number
    detuneF: number
    detuneFSharp: number
    detuneG: number
    detuneGSharp: number
    detuneA: number
    detuneBFlat: number
    detuneB: number
    pitchBendUp: number
    pitchBendDown: number
    bendMode: number
    aftertouch: number
}

export function newTuneChunk(): TuneChunk {
    const chunkName = [0x74, 0x75, 0x6e, 0x65] // 'tune'
    return newChunkFromSpec(chunkName, [
        'pad1',
        'semiToneTune', 'fineTune',
        'detuneC', 'detuneCSharp', 'detuneD', 'detuneEFlat', 'detuneE', 'detuneF', 'detuneFSharp', 'detuneG', 'detuneGSharp',
        'detuneA', 'detuneBFlat', 'detuneB',
        'pitchBendUp',
        'pitchBendDown',
        'bendMode',
        'aftertouch'
    ]) as TuneChunk
}

export interface Lfo1Chunk extends Chunk {
    waveform: number
    rate: number
    delay: number
    depth: number
    sync: number
    modwheel: number
    aftertouch: number
    rateMod: number
    delayMod: number
    depthMod: number
}

export function newLfo1Chunk(): Lfo1Chunk {
    const chunkName = [0x6c, 0x66, 0x6f, 0x20] // 'lfo '
    return newChunkFromSpec(chunkName, ['pad1', 'waveform', 'rate', 'delay', 'depth', 'sync', 'pad2', 'modwheel', 'aftertouch',
        'rateMod', 'delayMod', 'depthMod']) as Lfo1Chunk
}


export interface Lfo2Chunk extends Chunk {
    waveform: number
    rate: number
    delay: number
    depth: number
    retrigger: number
    rateMod: number
    delayMod: number
    depthMod: number
}

export function newLfo2Chunk(): Lfo2Chunk {
    const chunkName = [0x6c, 0x66, 0x6f, 0x20] // 'lfo '
    return newChunkFromSpec(chunkName, [
        'pad1',
        'waveform',
        'rate',
        'delay',
        'depth',
        'pad2',
        'retrigger',
        'pad3',
        'pad4',
        'rateMod',
        'delayMod',
        'depthMod'
    ]) as Lfo2Chunk
}

export interface ModsChunk extends Chunk {
    ampMod1Source: number
    ampMod2Source: number

    panMod1Source: number
    panMod2Source: number
    panMod3Source: number

    lfo1RateModSource: number
    lfo1DelayModSource: number
    lfo1DepthModSource: number

    lfo2RateModSource: number
    lfo2DelayModSource: number
    lfo2DepthModSource: number

    pitchMod1Source: number
    pitchMod2Source: number
    ampModSource: number
    filterModInput1: number
    filterModInput2: number
    filterModInput3: number
}

export function newModsChunk(): ModsChunk {
    const chunkName = [0x6d, 0x6f, 0x64, 0x73] // 'lfo '
    return newChunkFromSpec(chunkName, [
        'pad1',
        'pad2',
        'pad3',
        'pad4',
        'pad5',
        'ampMod1Source',
        'pad6',
        'ampMod2Source',
        'pad7',
        'panMod1Source',
        'pad8',
        'panMod2Source',
        'pad9',
        'panMod3Source',
        'pad10',
        'lfo1RateModSource',
        'pad11',
        'lfo1DelayModSource',
        'pad12',
        'lfo1DepthModSource',
        'pad13',
        'lfo2RateModSource',
        'pad14',
        'lfo2DelayModSource',
        'pad15',
        'lfo2DepthModSource',
        'pad15',
        'pitchMod1Source',
        'pad16',
        'pitchMod2Source',
        'pad17',
        'ampModSource',
        'pad19',
        'filterModInput1',
        'pad19',
        'filterModInput2',
        'pad20',
        'filterModInput3'
    ]) as ModsChunk
}


export interface KeygroupChunk extends Chunk {
    kloc: KlocChunk
    ampEnvelope: AmpEnvelopeChunk
    filterEnvelope: FilterEnvelopeChunk
    auxEnvelope: AuxEnvelopeChunk
    filter: FilterChunk
    zone1: ZoneChunk
    zone2: ZoneChunk
    zone3: ZoneChunk
    zone4: ZoneChunk
}

export interface KlocChunk extends Chunk {
    lowNote: number
    highNote: number
    semiToneTune: number
    fineTune: number
    overrideFx: number
    fxSendLevel: number
    pitchMod1: number
    pitchMod2: number
    ampMod: number
    zoneXFade: number
    muteGroup: number
}

class Pad {
    padCount = 0

    padField(): string {
        return 'pad' + this.padCount++
    }
}
export function newKeygroupChunk() {
    const chunkName = [0x6b, 0x67, 0x72, 0x70]
    return {
        parse(buf, offset): number {
            const pad = new Pad()
            checkOrThrow(buf, chunkName, offset)
            offset += parseChunkHeader(buf, this, offset)
            this.kloc = newChunkFromSpec([0x6b, 0x6c, 0x6f, 0x63], [
                pad.padField(),
                pad.padField(),
                pad.padField(),
                pad.padField(),
                'lowNote',
                'highNote',
                'semiToneTune',
                'fineTune',
                'overrideFx',
                'fxSendLevel',
                'pitchMod1',
                'pitchMod2',
                'ampMod',
                'zoneXFade',
                'muteGroup',
                pad.padField()
            ])
            offset += this.kloc.parse(buf, offset)

            this.ampEnvelope = newChunkFromSpec([0x65, 0x6e, 0x76, 0x20], [
                pad.padField(),
                'attack',
                pad.padField(),
                'decay',
                'release',
                pad.padField(),
                pad.padField(),
                'sustain',
                pad.padField(),
                pad.padField(),
                'velocity2Attack',
                pad.padField(),
                'keyscale',
                pad.padField(),
                'onVelocity2Release',
                pad.padField(),
                'offVelocity2Release',
                pad.padField(),
                pad.padField()
            ])
            offset += this.ampEnvelope.parse(buf, offset)
            return this.length
        }
    } as KeygroupChunk
}

export interface AmpEnvelopeChunk extends Chunk {
    attack: number
    decay: number
    release: number
    sustain: number
    velocity2Attack: number
    keyscale: number
    onVelocity2Release: number
    offVelocity2Release: number
}

export interface FilterEnvelopeChunk extends Chunk {

}

export interface AuxEnvelopeChunk extends Chunk {
    rate1: number
    rate2: number
    rate3: number
    rate4: number
    level1: number
    level2: number
    level3: number
    level4: number
    velocity2Rate1: number
    keyboard2Rate2and4: number
    velocity2Rate4: number
    offVelocity2Rate4: number
    velocity2OutLevel: number
}

export interface FilterChunk extends Chunk {
    mode: number
    cutoff: number
    resonance: number
    modInput1: number
    modInput2: number
    modInput3: number
    headroom: number
}

export interface ZoneChunk extends Chunk {
    sampleNameLength: number
    sampleName: number
    lowVelocity: number
    highVelocity: number
    fineTune: number
    semiToneTune: number
    filter: number
    panBalance: number
    playback: number
    output: number
    level: number
    keyboardTrack: number
    velocity2StartLsb: number
    velocity2startMsb: number
}