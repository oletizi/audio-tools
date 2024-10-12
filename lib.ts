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

    read(buf: Buffer, offset: number): number
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

export interface HeaderChunk extends Chunk {
}

export function newHeaderChunk(): HeaderChunk {
    const riff = [0x52, 0x49, 0x46, 0x46] // 'RIFF'
    const chunkLength = [0x00, 0x00, 0x00, 0x00] //  Chunk length: 0 (not correct, but that's what Akai does)
    const aprg = [0x41, 0x50, 0x52, 0x47] // 'APRG'
    return {
        length: bytes2Number(chunkLength),
        name: '',
        read(buf: Buffer, offset: number): number {
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

const programSpec = ["pad1", "programNumber", "keygroupCount", "pad2", "pad3", "pad4"]

export function newProgramChunk(): ProgramChunk {
    const chunkName = [0x70, 0x72, 0x67, 0x20] // 'prg '
    const chunkLength = [0x6, 0, 0, 0]         //  6
    return {
        name: '',
        length: 6,
        programNumber: 0,
        keygroupCount: 0,
        read(buf, offset) {
            checkOrThrow(buf, chunkName, offset)
            offset += parseChunkHeader(buf, this, offset)
            readFromSpec(buf, this, programSpec, offset)
            return this.length + 8
        },

        write(buf, offset) {
            offset += write(buf, chunkName, offset)
            offset += write(buf, chunkLength, offset)
            offset++ // unused byte after chunk length
            offset += writeByte(buf, this.programNumber, offset)
            offset += writeByte(buf, this.keygroupCount, offset)
            return this.length + 8
        }
    }
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
    const pad = 0
    return {
        name: '',
        length: -1,
        loudness: 84,
        ampMod1: 0,
        ampMod2: 0,
        panMod1: 0,
        panMod2: 0,
        panMod3: 0,
        velocitySensitivity: 24,
        read(buf: Buffer, offset: number): number {
            checkOrThrow(buf, chunkName, offset)
            offset += parseChunkHeader(buf, this, offset)
            readFromSpec(buf, this, outputSpec, offset)
            return this.length + 8
        },
        write(buf: Buffer, offset: number): number {
            return 0;
        }
    }
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

const tuneSpec = [
    'pad1',
    'semiToneTune', 'fineTune',
    'detuneC', 'detuneCSharp', 'detuneD', 'detuneEFlat', 'detuneE', 'detuneF', 'detuneFSharp', 'detuneG', 'detuneGSharp',
    'detuneA', 'detuneBFlat', 'detuneB',
    'pitchBendUp',
    'pitchBendDown',
    'bendMode',
    'aftertouch'
]

function newChunkFromSpec(chunkName: number[], spec: string[]) {
    return {
        read(buf: Buffer, offset: number): number {
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

export function newTuneChunk(): any {
    const chunkName = [0x74, 0x75, 0x6e, 0x65] // 'tune'
    return newChunkFromSpec(chunkName, tuneSpec)
}

// export interface Lfo1Chunk extends Chunk {
//     waveform: number
//     rate: number
//     delay: number
//     depth: number
//     sync: number
//     modwheel: number
//     aftertouch: number
//     rateMod: number
//     delayMod: number
//     depthMod: number
// }

const lfo1Spec = ['pad1', 'waveform', 'rate', 'delay', 'depth', 'sync', 'pad2', 'modwheel', 'aftertouch',
    'rateMod', 'delayMod', 'depthMod']

export function newLfo1Chunk(): any {
    const chunkName = [0x6c, 0x66, 0x6f, 0x20] // 'lfo '
    return newChunkFromSpec(chunkName, lfo1Spec)
    // return {
    //     name: '',
    //     length: -1,
    //     waveform: 0,
    //     rate: 0,
    //     delay: 0,
    //     depth: 0,
    //     sync: 0,
    //     modwheel: 0,
    //     aftertouch: 0,
    //     rateMod: 0,
    //     delayMod: 0,
    //     depthMod: 0,
    //     read(buf: Buffer, offset: number): number {
    //         checkOrThrow(buf, chunkName, offset)
    //         offset += parseChunkHeader(buf, this, offset)
    //         offset++ // unused byte
    //         this.waveform = readByte(buf, offset++)
    //         this.rate = readByte(buf, offset++)
    //         this.delay = readByte(buf, offset++)
    //         this.depth = readByte(buf, offset++)
    //         this.lfoSync = readByte(buf, offset++)
    //         offset++ // unused byte
    //         this.modwheel = readByte(buf, offset++)
    //         this.aftertouch = readByte(buf, offset++)
    //         this.rateMod = readByte(buf, offset++)
    //         this.delayMod = readByte(buf, offset++)
    //         this.depthMod = readByte(buf, offset++)
    //         return this.length + 8
    //     },
    //     write(buf: Buffer, offset: number): number {
    //         return 0;
    //     }
    // }
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
    return {
        name: '',
        length: -1,
        waveform: 0,
        rate: 0,
        delay: 0,
        depth: 0,
        retrigger: 0,
        rateMod: 0,
        delayMod: 0,
        depthMod: 0,
        read(buf: Buffer, offset: number): number {
            checkOrThrow(buf, chunkName, offset)
            offset += parseChunkHeader(buf, this, offset)
            offset++ // unused byte
            this.waveform = readByte(buf, offset++)
            this.rate = readByte(buf, offset++)
            this.delay = readByte(buf, offset++)
            this.depth = readByte(buf, offset++)
            offset++ // unused byte
            this.retrigger = readByte(buf, offset++)
            offset++ // unused byte
            offset++ // unused byte
            this.rateMod
            return this.length + 8;
        },
        write(buf: Buffer, offset: number): number {
            return 0;
        },
    }
}