import fs from "fs/promises";
import path from "path";
import {mpc} from "./akai-mpc";
import {newProgramFromBuffer} from "./akai-lib";
import {newSampleFromBuffer} from "./sample";
import {nullProgress, Progress} from "./progress";

export namespace translate {
    export async function mpc2Sxk(infile, outdir, outstream = process.stdout, progress: Progress = nullProgress) {
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
        outstream.write(`Done translating program.`)
    }
}