import fs from "fs/promises";
import path from "path";
import {mpc} from "./akai-mpc";
import {newProgramFromBuffer} from "./akai-lib";
import {decent} from './decent'
import {newSampleFromBuffer} from "./sample";
import {nullProgress, Progress} from "./progress";
import * as Path from "path";


export namespace translate {
    export async function decent2Sxk(infile, outdir, outstream = process.stdout, progress: Progress = nullProgress) {
        const ddir = path.dirname(infile)
        const programName = Path.parse(infile).name
        const dprogram = await decent.newProgramFromBuffer(await fs.readFile(infile))

        const sxkProgram = newProgramFromBuffer(await fs.readFile(path.join('data', 'DEFAULT.AKP')))
        const outbuf = Buffer.alloc(1024 * 1000)

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
                const basename = Path.parse(samplePath).name//path.basename(samplePath)
                const outpath = path.join(outdir, basename + '-' + keygroupCount + '.WAV');
                try {
                    // Chop sample and write to disk
                    const wav = newSampleFromBuffer(await fs.readFile(samplePath))
                    let trimmed = wav.trim(sample.start, sample.end)
                    trimmed = trimmed.to16Bit()
                    const bytesWritten = trimmed.write(outbuf, 0)
                    outstream.write(`TRANSLATE: writing trimmed sample to: ${outpath}\n`)
                    await fs.writeFile(outpath, Buffer.copyBytesFrom(outbuf, 0, bytesWritten))
                } catch (e) {
                    console.error(e)
                } finally {
                    progress.incrementCompleted(1)
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

        for (const layer of mpcProgram.layers) {
            // chop & copy sample
            const samplePath = path.join(mpcdir, layer.sampleName + '.WAV')
            const sliceName = `${layer.sampleName}-${sliceCounter++}-${snapshot}`

            try {
                const sample = newSampleFromBuffer(await fs.readFile(samplePath))
                let trimmed = sample.trim(layer.sliceStart, layer.sliceEnd)
                trimmed = trimmed.to16Bit()

                const bytesWritten = trimmed.write(outbuf, 0)
                let outpath = path.join(outdir, sliceName + '.WAV');
                outstream.write(`TRANSLATE: writing trimmed sample to: ${outpath}\n`)
                await fs.writeFile(outpath, Buffer.copyBytesFrom(outbuf, 0, bytesWritten))
            } catch (err) {
                // no joy
                console.error(err)
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