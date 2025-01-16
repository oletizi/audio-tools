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

export async function genInterface(spec: Spec) {
    let rv = `interface ${spec.name} {\n`
    for (const field of spec.fields) {
        rv += `  ${field.n}: ${field.t ? field.t : 'number'}    // ${field.d}\n`
    }
    rv += '}'
    return rv
}

export async function genParser(spec: Spec) {
    let rv = `function parse${spec.name}(data: byte[], o: ${spec.name}) {\n`
    rv += `  const out = newClientOutput(true, 'parse${spec.name}')\n`
    rv += `  const v = {value: 0, offset: 0}\n\n`
    rv += '  let b: byte[]\n'
    for (const field of spec.fields) {
        rv += `  // ${field.d}\n`
        rv += `  out.log(${field.n} + ': offset: ' + v.offset')\n`
        if (field.t) {
            rv += '  // string parse here\n'
            rv += '  for (let i = 0; i < 12; i++) {\n' +
                '      nextByte(m, v)\n' +
                `      o.${field.n} += akaiByte2String([v.value])\n` +
                '  }\n'
        } else {
            rv += `  b = []\n`
            rv += `  for (let i=0; i<${field.s ? field.s : 1}; i++) {\n`
            rv += '    b.push(nextByte(m, v))\n'
            rv += `  }\n`
            rv += `  o.${field.n} = bytes2numberLE(b)\n`
            rv += '  // number parse here\n'
        }
        rv += '\n'
    }
    rv += '}'
    return rv
}