import * as htmlparser2 from "htmlparser2"

export namespace mpc {
    export function newProgramFromBuffer(buf) {
        const layers = []
        const program = {
            layers: layers
        }
        let inProgramName = false
        let inLayer = false
        let layer = {}
        let inSampleName = false
        let inSliceStart = false
        let inSliceEnd = false
        const parser = new htmlparser2.Parser({
            onopentag(name: string, attribs: { [p: string]: string }, isImplied: boolean) {
                switch (name) {
                    case "programname":
                        inProgramName = true
                        break
                    case "instrument" :
                        break
                    case "layer":
                        inLayer = true
                        layer['number'] = Number.parseInt(attribs['number'])
                        break
                    case "samplename":
                        inSampleName = true
                        break
                    case "slicestart":
                        inSliceStart = true
                        break
                    case "sliceend":
                        inSliceEnd = true
                        break
                    default:
                        break
                }

            },
            ontext(data: string) {
                if (inProgramName) {
                    program['programName'] = data
                } else if (inSampleName) {
                    layer['sampleName'] = data
                    // this layer has a sample name, so we care about it
                    layers.push(layer)
                } else if (inSliceStart) {
                    layer['sliceStart'] = Number.parseInt(data)
                } else if (inSliceEnd) {
                    layer['sliceEnd'] = Number.parseInt(data)
                }
            },
            onclosetag(name: string, isImplied: boolean) {
                switch (name) {
                    case "programname":
                        inProgramName = false
                        break
                    case "layer":
                        inLayer = false
                        layer = {}
                        break
                    case "samplename":
                        inSampleName = false
                        break
                    case "slicestart":
                        inSliceStart = false
                        break
                    case "sliceend":
                        inSliceEnd = false
                        break
                    default:
                        break
                }
            }
        })
        parser.write(buf.toString())
        return program as MpcProgram
    }

    export interface Layer {
        number: number
        sampleName: string
        sliceStart: number
        sliceEnd: number
    }

    export interface MpcProgram {
        programName: string
        layers: Layer[]
    }
}
