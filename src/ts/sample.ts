import wavefile from "wavefile";

export function newSampleFromBuffer(buf: Uint8Array): Sample {
    const wav = new wavefile.WaveFile()
    wav.fromBuffer(buf)
    return new WavSample(wav)
}

export interface Sample {
    trim(start, end): Sample
    to16Bit() : Sample
    write(buf: Buffer, offset: number)
}

class WavSample implements Sample {
    private readonly wav: wavefile.WaveFile;

    constructor(wav: wavefile.WaveFile) {
        this.wav = wav
    }
    to16Bit(): Sample {
        this.wav.toBitDepth("16")
        return this
    }

    trim(start, end): Sample {
        const channelCount = this.wav.fmt.numChannels
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
}