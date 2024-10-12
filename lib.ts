import * as Buffer from "buffer";

function write(buf: Buffer, data: number[], offset: number): number {
    buf.set(data, offset)
    return offset + data.length
}

function writeByte(buf: Buffer, n: number, offset: number): number {
    buf.writeInt8(n, offset)
    return offset + 1
}

function readByte(buf, offset): number {
    return buf.readInt8(offset)
}

function checkOrThrow(buf, data, offset) {
    for (let i = 0; i < data.length; i++, offset++) {
        if (data[i] != buf.readInt8(offset)) {
            throw new Error(`Bad vibes at: ${offset}. Expected ${data[i]} but found ${buf.readInt8(offset)}`)
        }
    }
    return offset
}

export interface Chunk {
    length: number

    write(buf: Buffer, offset: number): number

    read(buf: Buffer, offset: number): number
}

export interface HeaderChunk extends Chunk {
}


export function newHeaderChunk(): HeaderChunk {
    const riff = [0x52, 0x49, 0x46, 0x46] // 'RIFF'
    const chunkLength = [0x00, 0x00, 0x00, 0x00] //  Chunk length: 0 (not correct, but that's what Akai does)
    const aprg = [0x41, 0x50, 0x52, 0x47] // 'APRG'
    return {
        length: 12,
        read(buf: Buffer, offset: number): number {
            offset = checkOrThrow(buf, riff, offset)
            offset = checkOrThrow(buf, chunkLength, offset)
            offset = checkOrThrow(buf, aprg, offset)
            return offset
        },
        write(buf: Buffer, offset: number): number {
            offset = write(buf, riff, offset)
            offset = write(buf, chunkLength, offset)
            offset = write(buf, aprg, offset)
            return offset
        }
    }
}


export interface ProgramChunk extends Chunk {
    programNumber: number
    keygroupCount: number
}

export function newProgramChunk(): ProgramChunk {
    const chunkName = [0x70, 0x72, 0x67, 0x20] // 'prg '
    const chunkLength = [0x6, 0, 0, 0]         //  6
    const pad = [0x00, 0x02, 0x01]
    return {
        length: 6,
        programNumber: 0,
        keygroupCount: 0,
        read(buf, offset) {
            offset = checkOrThrow(buf, chunkName, offset)
            offset = checkOrThrow(buf, chunkLength, offset)
            offset++ // unused byte after chunk length
            this.programNumber = readByte(buf, offset++)
            this.keygroupCount = readByte(buf, offset++)
            offset = checkOrThrow(buf, pad, offset)
            return offset
        },

        write(buf, offset) {
            offset = write(buf, chunkName, offset)
            offset = write(buf, chunkLength, offset)
            offset++ // unused byte after chunk length
            offset = writeByte(buf, this.programNumber, offset)
            offset = writeByte(buf, this.keygroupCount, offset)
            offset = write(buf, pad, offset)
            return offset
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

export function newOutputChunk(): OutputChunk {
    const chunkName = [0x6f, 0x75, 0x74, 0x20]   // 'out '
    const chunkLength = [0x08, 0x00, 0x00, 0x00] //  8
    return {
        length: 8,
        loudness: 84,
        ampMod1: 0,
        ampMod2: 0,
        panMod1: 0,
        panMod2: 0,
        panMod3: 0,
        velocitySensitivity: 24,
        read(buf: Buffer, offset: number): number {
            offset = checkOrThrow(buf, chunkName, offset)
            offset = checkOrThrow(buf, chunkLength, offset)
            offset++ // unused byte after chunk length
            this.loudness = readByte(buf, offset++)
            this.ampMod1 = readByte(buf, offset++)
            this.ampMod2 = readByte(buf, offset++)
            this.panMod1 = readByte(buf, offset++)
            this.panMod2 = readByte(buf, offset++)
            this.panMod3 = readByte(buf, offset++)
            this.velocitySensitivity = readByte(buf, offset++)
            return offset;
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

export function newTuneChunk(): TuneChunk {
    const chunkName = [0x74, 0x75, 0x6e, 0x65] // 'tune'
    const chunkSize = [0x18, 0x00, 0x00, 0x00] //  24
    return {
        aftertouch: 0,
        bendMode: 0,
        detuneA: 0,
        detuneB: 0,
        detuneBFlat: 0,
        detuneC: 0,
        detuneCSharp: 0,
        detuneD: 0,
        detuneE: 0,
        detuneEFlat: 0,
        detuneF: 0,
        detuneFSharp: 0,
        detuneG: 0,
        detuneGSharp: 0,
        pitchBendDown: 0,
        pitchBendUp: 0,
        fineTune: 0, semiToneTune: 0,
        length: 0,
        read(buf: Buffer, offset: number): number {
            offset = checkOrThrow(buf, chunkName, offset)
            offset = checkOrThrow(buf, chunkSize, offset)
            offset++ // unused byte after chunk size
            this.aftertouch = readByte(buf, offset++)
            this.bendMode = readByte(buf, offset++)
            this.detuneC = readByte(buf, offset++)
            this.detuneCSharp = readByte(buf, offset++)
            this.detuneD = readByte(buf, offset++)
            this.detuneEFlat = readByte(buf, offset++)
            this.detuneE = readByte(buf, offset++)
            this.detuneF = readByte(buf, offset++)
            this.detuneFSharp = readByte(buf, offset++)
            this.detuneG = readByte(buf, offset++)
            this.detuneGSharp = readByte(buf, offset++)
            this.detuneA = readByte(buf, offset++)
            this.detuneBFlat = readByte(buf, offset++)
            this.detuneB = readByte(buf, offset++)
            this.pitchBendUp = readByte(buf, offset++)
            this.pitchBendDown = readByte(buf, offset++)
            this.bendMode = readByte(buf, offset++)
            this.aftertouch = readByte(buf, offset++)
            offset++ // unused bytes
            offset++
            offset++
            return offset
        },
        write(buf: Buffer, offset: number): number {
            return 0;
        }
    }
}