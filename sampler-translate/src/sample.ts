import {WriteStream} from "fs";
import * as wavefile from "wavefile"

// Possible alternatives to wavefile:
// * https://www.npmjs.com/package/node-wav
//

export function newSampleFromBuffer(buf: Uint8Array): Sample {
    return new WavSample(buf)
}

// See: https://www.recordingblogs.com/wiki/sample-chunk-of-a-wave-file
export interface SampleMetadata {
    manufacturerId: number
    productId: number
    samplePeriod: number
    rootNote: number
    pitchFraction: number
    smpteFormat: number
    smpteOffset: number
    loopCount: number
    sampleLength: number
    channelCount: number
    bitDepth: number
    sampleRate: number
}


export interface Sample {

    getMetadata(): SampleMetadata

    getSampleCount(): number

    getChannelCount(): number

    getSampleRate(): number

    getBitDepth(): number

    setRootNote(r: number): void

    trim(start: number, end: number): Sample

    to16Bit(): Sample

    to24Bit(): Sample

    to441(): Sample

    to48(): Sample

    cleanup(): Sample

    write(buf: Buffer, offset: number): number

    /**
     * Writes sample data to stream; returns the number of bytes written
     * @param stream
     */
    writeToStream(stream: WriteStream): Promise<number>

    getSampleData(): Float64Array;

    getRawData(): Uint8Array

}

class WavSample implements Sample {
    private readonly wav: any
    private buf: Uint8Array;

    constructor(buf: Uint8Array) {
        this.buf = buf
        const wav = new wavefile.default.WaveFile()
        wav.fromBuffer(buf)
        this.wav = wav
    }

    getMetadata(): SampleMetadata {
        const rv = {} as SampleMetadata
        const smpl = this.wav.smpl
        if (smpl) {
            // @ts-ignore
            rv.manufacturerId = smpl['dwManufacturer']
            // @ts-ignore
            rv.productId = smpl['dwProduct']
            // @ts-ignore
            rv.samplePeriod = smpl['dwSamplePeriod']
            // @ts-ignore
            rv.rootNote = smpl['dwMIDIUnityNote']
            // @ts-ignore
            rv.pitchFraction = smpl['dwMIDIPitchFraction']
            // @ts-ignore
            rv.smpteFormat = smpl['dwSMPTEFormat']
            // @ts-ignore
            rv.smpteOffset = smpl['dwSMPTEOffset']
            // @ts-ignore
            rv.loopCount = smpl['dwNumSampleLoops']
        }
        rv.sampleLength = this.getSampleCount()
        rv.sampleRate = this.getSampleRate()
        rv.channelCount = this.getChannelCount()
        rv.bitDepth = this.getBitDepth()
        return rv
    }

    getChannelCount(): number {
        // @ts-ignore
        return this.wav.fmt["numChannels"]
    }

    getSampleCount(): number {
        // XXX: There's probably a more efficient way to do this
        const channelCount = this.getChannelCount() ? this.getChannelCount() : 1
        return this.wav.getSamples(true).length / channelCount
    }

    getSampleRate(): number {
        // @ts-ignore
        return this.wav.fmt.sampleRate
    }

    getBitDepth(): number {
        return parseInt(this.wav.bitDepth)
    }

    setRootNote(r: number) {
        // @ts-ignore
        this.wav.smpl['dwMIDIUnityNote'] = r
    }

    to16Bit(): Sample {
        this.wav.toBitDepth("16")
        return this
    }

    to24Bit(): Sample {
        this.wav.toBitDepth("24")
        return this
    }

    to441(): Sample {
        this.wav.toSampleRate(44100)
        return this
    }

    to48(): Sample {
        this.wav.toSampleRate(48000)
        return this
    }

    trim(start: number, end: number): Sample {
        // @ts-ignore
        const channelCount = this.wav.fmt["numChannels"]
        const trimmedSamples = this.wav.getSamples(true).slice(start * channelCount, end * channelCount)
        const trimmed = new wavefile.default.WaveFile()
        // @ts-ignore
        trimmed.fromScratch(channelCount, this.wav.fmt.sampleRate, this.wav.bitDepth, trimmedSamples)
        return newSampleFromBuffer(trimmed.toBuffer())
    }

    write(buf: Buffer, offset: number) {
        const wavBuffer = Buffer.from(this.wav.toBuffer())
        wavBuffer.copy(buf, offset, 0, wavBuffer.length)
        return wavBuffer.length
    }

    writeToStream(stream: WriteStream): Promise<number> {
        return new Promise((resolve, reject) => {
            stream.on('error', (e => reject(e)))
            const buf = this.wav.toBuffer()
            stream.write(buf)
            stream.end(() => resolve(buf.length))
        })
    }

    cleanup(): Sample {
        // @ts-ignore
        const sampleLength = this.wav.data.chunkSize / this.wav.fmt["numChannels"];
        this.wav.fact = {
            chunkId: "fact",
            chunkSize: 4,
            dwSampleLength: sampleLength
        }
        return this
    }

    getSampleData(): Float64Array {
        return this.wav.getSamples(true)
    }

    getRawData(): Uint8Array {
        return this.buf
    }
}