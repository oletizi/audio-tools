import {program} from "commander"
import {mpc} from "./akai-mpc";
import fs from "fs/promises";
import {newProgramFromBuffer} from "./akai-lib";
import path from "path";
import {newSampleFromBuffer} from "./sample";


// const buf = fs.readFile()
// const program = mpc.newProgramFromBuffer(buf)
program
    .version('0.1')
    .description('Translates sampler programs to Akai S5000/6000 (SxK) format.')
    .command('mpc')
    .argument('<infile>', 'Path the Akai MPC program file.')
    .argument('<outdir>', 'Directory to write Akai SxK program and samples.')
    .action(async (infile, outdir) => {
        console.log(`infile : ${infile}`)
        console.log(`outdir : ${outdir}`)
        await mpc2Sxk(infile, outdir)
    })

program.parse()

async function mpc2Sxk(infile, outdir) {
    const mpcbuf = await fs.readFile(infile)
    const mpcdir = path.dirname(infile)
    const mpcProgram = mpc.newProgramFromBuffer(mpcbuf)

    const sxkbuf = await fs.readFile('data/DEFAULT.AKP')
    const sxkProgram = newProgramFromBuffer(sxkbuf)
    const snapshot = new Date().getTime()


    const mods = {
        keygroupCount: mpcProgram.layers.length,
        keygroups: []
    }
    const inbuf = Buffer.alloc(1024 * 10000)
    const outbuf = Buffer.alloc(inbuf.length)
    let sliceCounter = 1
    for (const layer of mpcProgram.layers) {
        // chop & copy sample
        const samplePath = path.join(mpcdir, layer.sampleName + '.WAV')
        const sliceName = `${layer.sampleName}-${snapshot}-${sliceCounter++}`

        try {
            const sample = newSampleFromBuffer(await fs.readFile(samplePath))
            const trimmed = sample.trim(layer.sliceStart, layer.sliceEnd)
            const bytesWritten = trimmed.write(outbuf, 0)
            let outpath = path.join(outdir, sliceName + '.WAV');
            console.log(`writing trimmed sample to: ${outpath}`)
            await fs.writeFile(outpath, Buffer.copyBytesFrom(outbuf, 0, bytesWritten))
        } catch (err) {
            // no joy
            console.error(err)
        }

        mods.keygroups.push({
            zone1: {
                sampleName: sliceName
            }
        })
    }

    sxkProgram.apply(mods)
    const bufferSize = sxkProgram.writeToBuffer(outbuf, 0)
    await fs.writeFile(path.join(outdir, mpcProgram.programName + '.AKP'), Buffer.copyBytesFrom(outbuf, 0, bufferSize))
}