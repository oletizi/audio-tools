import fs from 'fs/promises'
import * as riff from 'riff-parser'
import {writeHeader} from "./lib.js";

const kb = 2 * 1024
const buf = Buffer.alloc(kb)

try {
    await fs.stat('build')
} catch (err) {
    await fs.mkdir('build')
}



// const ws = fs.createWriteStream('data/prog.akp')
writeHeader(buf)
await fs.writeFile('build/program.akp', buf)

riff.parseRiffFile('test/data/BASS.AKP', (err, chunk) => {
    if (err) {
        console.error(err)
    } else {
        console.log(`Chunk!`)
        console.log(`Description: ${chunk.description()}`)
        console.log(`Data description: ${chunk.dataDescription()}`)
        console.log(chunk)
    }
})
