import {program} from "commander"
import {translate} from "@/lib/lib-translate"

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
        await translate.mpc2Sxk(infile, outdir)
    })

program.parse()

