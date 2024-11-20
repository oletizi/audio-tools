import fs from "fs/promises";
import {createWriteStream, WriteStream} from "fs";
import path from "path";
import {mpc} from "@/lib/lib-akai-mpc";
import {newProgramFromBuffer} from "@/lib/lib-akai-s56k";
import {decent} from '@/lib/lib-decent'
import {newSampleFromBuffer} from "@/model/sample"
import {nullProgress, Progress} from "@/model/progress"
import * as Path from "path";
import {pad, Result} from "@/lib/lib-core";
import {newServerOutput} from "@/process-output";


const out = newServerOutput()

export namespace translate {

    function hasher(text: string, max: number) {
        let hash
        for (let i = 0; i < text.length && i <= max; i++) {
            let char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash
    }

    export async function decent2Sxk(infile, outdir, outstream = process.stdout, progress: Progress = nullProgress) {
        const rv = { data: null, errors: []} as Result
        const ddir = path.dirname(infile)
        const programName = Path.parse(infile).name
        const hash = hasher(programName, 12)
        const dprogram = await decent.newProgramFromBuffer(await fs.readFile(infile))

        const sxkProgram = newProgramFromBuffer(await fs.readFile(path.join('data', 'DEFAULT.AKP')))
        let outbuf = Buffer.alloc(1024 * 1000) // XXX: This is a data corruption bug waiting to happen
        let fstream: WriteStream
        let keygroupCount = 0
        const keygroups = []
        for (const group of dprogram.groups) {
            keygroupCount += group.samples.length
        }
        progress.setTotal(keygroupCount + 1) // one progress increment for each keygroup, one for the program file
        keygroupCount = 0

        for (const group of dprogram.groups) {
            for (const sample of group.samples) {
                keygroupCount++
                const samplePath = path.join(ddir, sample.path)
                let basename = hash + '-' + pad(keygroupCount, 3);
                const outname = basename + '.WAV'
                const outpath = path.join(outdir, outname);
                try {
                    // Chop sample and write to disk
                    let wav = newSampleFromBuffer(await fs.readFile(samplePath))
                    if (!Number.isNaN(sample.start) && !Number.isNaN(sample.end)) {
                        wav = wav.trim(sample.start, sample.end)
                    }

                    wav = wav.to16Bit()
                    wav = wav.to441()
                    wav.cleanup()


                    outstream.write(`TRANSLATE: writing trimmed sample to: ${outpath}\n`)
                    fstream = createWriteStream(outpath)
                    const bytesWritten = await wav.writeToStream(fstream)
                    outstream.write(`TRANSLATE: wrote ${bytesWritten} bytes to ${outpath}\n`)
                } catch (e) {
                    rv.errors.push(e)
                } finally {
                    progress.incrementCompleted(1)
                    if (fstream) {
                        fstream.close((e => {
                            if (e) rv.errors.push(e)
                        }))
                    }
                }
                keygroups.push({
                    kloc: {
                        lowNote: sample.loNote,
                        highNote: sample.hiNote,
                    },
                    zone1: {
                        sampleName: basename
                    }
                })
            }
        }

        const mods = {
            keygroupCount: keygroupCount,
            keygroups: keygroups
        }
        sxkProgram.apply(mods)

        const bufferSize = sxkProgram.writeToBuffer(outbuf, 0)
        let outfile = path.join(outdir, programName + '.AKP');
        outstream.write(`Writing program file: ${outfile}\n`)
        await fs.writeFile(outfile, Buffer.copyBytesFrom(outbuf, 0, bufferSize))
        progress.incrementCompleted(1)
        rv.data = sxkProgram
        return rv
    }

    export async function mpc2Sxk(infile, outdir, outstream = process.stdout, progress: Progress = nullProgress) {
        progress.setCompleted(0)
        const mpcbuf = await fs.readFile(infile)
        const mpcdir = path.dirname(infile)
        const mpcProgram = mpc.newProgramFromBuffer(mpcbuf)

        const sxkbuf = await fs.readFile('data/DEFAULT.AKP')
        const sxkProgram = newProgramFromBuffer(sxkbuf)
        const snapshot = new Date().getMilliseconds()

        const mods = {
            keygroupCount: mpcProgram.layers.length,
            keygroups: []
        }
        const inbuf = Buffer.alloc(1024 * 10000)
        const outbuf = Buffer.alloc(inbuf.length)
        let sliceCounter = 1
        let midiNote = 60
        let detune = 0

        progress.setTotal(mpcProgram.layers.length + 1)

        // for (const layer of mpcProgram.layers) {
        for (let i = 0; i < mpcProgram.layers.length; i++) {
            const layer = mpcProgram.layers[i]
            // chop & copy sample
            const samplePath = path.join(mpcdir, layer.sampleName + '.WAV')
            const basename = layer.sampleName.substring(0, 8)
            const sliceName = `${basename}-${sliceCounter++}-${snapshot}`

            try {
                let buf = await fs.readFile(samplePath);
                let sliceStart = 0
                let sliceEnd = 0

                let sliceData;
                try {
                    sliceData = mpc.newSampleSliceDataFromBuffer(buf)
                } catch (e) {
                    out.error(e)
                }

                // Check the sample for embedded slice data
                out.log(`CHECKING SAMPLE FOR EMBEDDED SLICE DATA...`)
                if (sliceData && sliceData.slices.length >= i) {
                    const slice = sliceData.slices[i]

                    sliceStart = slice.start
                    sliceEnd = slice.end
                } else {
                    sliceStart = layer.sliceStart
                    sliceEnd = layer.sliceEnd
                }

                const sample = newSampleFromBuffer(buf)
                let trimmed = sample.trim(sliceStart, sliceEnd)
                trimmed = trimmed.to16Bit()

                const bytesWritten = trimmed.write(outbuf, 0)
                let outpath = path.join(outdir, sliceName + '.WAV');
                outstream.write(`TRANSLATE: writing trimmed sample to: ${outpath}\n`)
                await fs.writeFile(outpath, Buffer.copyBytesFrom(outbuf, 0, bytesWritten))
            } catch (err) {
                // no joy
                out.error(err)
            } finally {
                progress.incrementCompleted(1)
            }

            mods.keygroups.push({
                kloc: {
                    lowNote: midiNote,
                    highNote: midiNote++,
                    semiToneTune: detune--
                },
                zone1: {
                    sampleName: sliceName
                }
            })
        }

        sxkProgram.apply(mods)
        const bufferSize = sxkProgram.writeToBuffer(outbuf, 0)
        let outfile = path.join(outdir, mpcProgram.programName + '.AKP');
        outstream.write(`Writing program file: ${outfile}\n`)
        await fs.writeFile(outfile, Buffer.copyBytesFrom(outbuf, 0, bufferSize))
        progress.incrementCompleted(1)
    }
}