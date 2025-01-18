import {parse} from 'yaml'
import * as fs from 'fs/promises'

interface Spec {
    name: string
    headerOffset: number
    fields: {
        n: string,  // name
        l?: string, // label
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
        rv += `  ${field.n}Label: string\n`
        // rv += `  set${field.n}(header: ${spec.name}, v: ${field.t ? field.t : 'number'})\n`
        rv += `\n`
    }
    rv += '  raw: number[] // Raw sysex message data\n'
    rv += '}\n'
    return rv
}

export async function genSetters(spec: Spec) {
    let rv = ''
    let offset = 8 + spec.headerOffset
    for (const field of spec.fields) {
        const fname = `${spec.name}_write${field.n}`
        rv += `export function ${fname}(header: ${spec.name}, v: ${field.t ? field.t : 'number'}) {\n`
        rv += `    const out = newClientOutput(true, '${fname}')\n`
        rv += `    out.log('Offset: ' + ${offset})\n`
        if (field.t) {
            rv += `    // IMPLEMENT ME!\n`
        } else {
            //         const d = byte2nibblesLE(polyphony)
            //         header.raw[offset] = d[0]
            //         header.raw[offset + 1] = d[1]
            rv += `    const d = byte2nibblesLE(v)\n`
            rv += `    header.raw[${offset}] = d[0]\n`
            rv += `    header.raw[${offset} + 1] = d[1]\n`
        }
        rv += `}\n\n`
        offset += field.s ? field.s * 2 : 2
    }
    return rv
}

export async function genParser(spec: Spec) {
    let rv = `export function parse${spec.name}(data: number[], offset: number, o: ${spec.name}) {\n`
    rv += `    const out = newClientOutput(true, 'parse${spec.name}')\n`
    rv += `    const v = {value: 0, offset: offset * 2}\n\n`
    rv += '    let b: number[]\n'
    rv += '    function reloff() {\n' +
        '        // This calculates the current offset into the header data so it will match with the Akai sysex docs for sanity checking. See https://lakai.sourceforge.net/docs/s2800_sysex.html\n' +
        '        // As such, The math here is weird: \n' +
        '        // * Each offset "byte" in the docs is actually two little-endian nibbles, each of which take up a slot in the midi data array--hence v.offset /2 \n' +
        '        return (v.offset / 2)\n' +
        '    }\n\n'
    for (const field of spec.fields) {
        rv += `    // ${field.d}\n`
        rv += `    out.log('${field.n}: offset: ' + reloff())\n`
        if (field.l) {
            rv += `    o["${field.n}Label"] = "${field.l}"\n`
        }
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