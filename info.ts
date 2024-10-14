import fs from "fs/promises"
import * as lib from "./lib.ts"

const buf = await fs.readFile('data/DEFAULT.AKP')
const program = lib.newProgramFromBuffer(buf)
console.log(JSON.stringify(program, null, '  '))