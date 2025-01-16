import {parse} from 'yaml'
import * as fs from 'fs/promises'

interface Spec {
    name: string
    fields: {
        n: string,  // name
        d: string,  // description
        s?: number, // size in bytes; 1 if undefined
        t?: number   // type; number if undefined
    }[]
}

export async function readSpecs(file: string) {
    return parse((await fs.readFile(file)).toString())
}

export function genImports() {
    return `//
// GENERATED ${new Date()}. DO NOT EDIT.
//    
import {byte2nibblesLE, bytes2numberLE, nibbles2byte} from "@/lib/lib-core"
import {newClientOutput} from "@/lib/process-output"
import {nextByte, akaiByte2String} from "@/midi/akai-s3000xl"
    
`
}

export async function genInterface(spec: Spec) {
    let rv = `export interface ${spec.name} {\n`
    for (const field of spec.fields) {
        rv += `  ${field.n}: ${field.t ? field.t : 'number'}    // ${field.d}\n`
    }
    rv += '}'
    return rv
}

export async function genParser(spec: Spec) {
    let rv = `export function parse${spec.name}(data: number[], o: ${spec.name}) {\n`
    rv += `    const out = newClientOutput(true, 'parse${spec.name}')\n`
    rv += `    const v = {value: 0, offset: 0}\n\n`
    rv += '    let b: number[]\n'
    rv += '    function reloff() {\n' +
        '        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking.' +
        '        // Math here is weird. It\'s to agree with offsets in Akai sysex docs: https://lakai.sourceforge.net/docs/s2800_sysex.html\n' +
        '        // Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--\n' +
        '        // hence v.offset /2 . And, the offsets start counting at 1, hence +1.\n' +
        '        return (v.offset / 2) + 1\n' +
        '    }\n\n'
    for (const field of spec.fields) {
        rv += `    // ${field.d}\n`
        rv += `    out.log('${field.n}: offset: ' + reloff())\n`
        if (field.t) {
            rv += `    o.${field.n} = ''\n` +
                '    for (let i = 0; i < 12; i++) {\n' +
                '          nextByte(data, v)\n' +
                `          o.${field.n} += akaiByte2String([v.value])\n` +
                `          out.log('${field.n} at ' + i + ': ' + o.${field.n})` +
                '    }\n'
        } else {
            rv += `    b = []\n`
            rv += `    for (let i=0; i<${field.s ? field.s : 1}; i++) {\n`
            rv += '        b.push(nextByte(data, v).value)\n'
            rv += `    }\n`
            rv += `    o.${field.n} = bytes2numberLE(b)\n`
        }
        rv += '\n'
    }
    rv += '}'
    return rv
}