import * as htmlparser2 from "htmlparser2"

export namespace mpc {
    export function newProgramFromBuffer(buf) {
        const layers = []
        let inLayer = false
        let layer = {}
        let inSampleName = false
        const parser = new htmlparser2.Parser({
            onopentag(name: string, attribs: { [p: string]: string }, isImplied: boolean) {
                switch (name) {
                    case "instrument" :
                        // console.log(`Instrument! ${attribs['number']}`)
                        break
                    case "layer":
                        // console.log(`Layer: ${attribs['number']}`)
                        inLayer = true
                        layer['number'] = attribs['number']
                        break
                    case "samplename":
                        // console.log(`entering sample file`)
                        inSampleName = true
                        break
                    default:
                        break
                }

            },
            ontext(data: string) {
                if (inSampleName) {
                    // console.log(`sample name: ${data}`)
                    layer['sampleName'] = data
                    // this layer has a sample name, so we care about it
                    layers.push(layer)
                }
            },
            onclosetag(name: string, isImplied: boolean) {
                switch (name) {
                    case "layer":
                        // console.log(`layer: ${JSON.stringify(layer, null, 2)}`)
                        inLayer = false
                        layer = {}
                        break
                    case "samplename":
                        // console.log(`close sample file`)
                        inSampleName = false
                        break
                    default:
                        break
                }
            }
        })
        parser.write(buf.toString())
        return { layers: layers} as MpcProgram
    }

    export interface MpcProgram {
        layers: []
    }
}
