import wavefile from "wavefile";
import {WriteStream} from "fs";

export function newSampleFromBuffer(buf: Uint8Array): Sample {
    const wav = new wavefile.WaveFile()
    wav.fromBuffer(buf)
    return new WavSample(wav)
}

export interface Sample {
    getSampleCount(): number

    getChannelCount(): number

    trim(start, end): Sample

    to16Bit(): Sample

    to441(): Sample

    cleanup(): Sample

    write(buf: Buffer, offset: number)

    /**
     * Writes sample data to stream; returns the number of bytes written
     * @param stream
     */
    writeToStream(stream: WriteStream): Promise<number>
}

class WavSample implements Sample {
    private readonly wav: wavefile.WaveFile;

    constructor(wav: wavefile.WaveFile) {
        this.wav = wav
    }

    getChannelCount(): number {
        return this.wav.fmt["numChannels"]
    }

    getSampleCount(): number {
        // XXX: There's probably a more efficient way to do this
        return this.wav.getSamples().length
    }

    to16Bit(): Sample {
        this.wav.toBitDepth("16")
        return this
    }

    to441(): Sample {
        this.wav.toSampleRate(44100)
        return this
    }

    trim(start, end): Sample {
        const channelCount = this.wav.fmt["numChannels"]
        const trimmedSamples = this.wav.getSamples(true).slice(start * channelCount, end * channelCount)
        const trimmed = new wavefile.WaveFile()
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
        this.wav.fact = {
            chunkId: "fact",
            chunkSize: 4,
            dwSampleLength: this.wav.data.chunkSize / this.wav.fmt["numChannels"]
        }
        return this
    }
}