import {program} from "commander"
import {mpc} from "./akai-mpc";
import fs from "fs/promises";
import {newProgramFromBuffer} from "./akai-lib";
import path from "path";


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
    const mpcProgram = mpc.newProgramFromBuffer(mpcbuf)

    const sxkbuf = await fs.readFile('data/DEFAULT.AKP')
    const sxkProgram = newProgramFromBuffer(sxkbuf)
    const snapshot = new Date().getMilliseconds()


    const mods = {
        keygroupCount: mpcProgram.layers.length,
        keygroups: []
    }

    for (const layer  of mpcProgram.layers) {
        mods.keygroups.push({
            zone1: {
                sampleName: `${layer.sampleName}-${snapshot}-${layer.number}`
            }
        })
    }

    sxkProgram.apply(mods)
    const outbuf = Buffer.alloc(1024 * 10)
    const bufferSize = sxkProgram.writeToBuffer(outbuf, 0)

    await fs.writeFile(path.join(outdir, mpcProgram.programName + 'AKP'), Buffer.copyBytesFrom(outbuf, 0, bufferSize))
}