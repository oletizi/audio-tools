import * as htmlparser2 from "htmlparser2";

export namespace decent {
    interface Sample {
        decayCurve: number
        decay: number
        attackCurve: number
        attack: number
        path: string
    }

    interface Group {
        samples: Sample[]
    }

    interface Program {
        groups: Group[];
    }

    export async function newProgramFromBuffer(buf: Buffer) {
        const program = {
            groups: []
        }
        let group: Group
        let inGroups = false
        let inGroup = false
        let inSample = false
        const parser = new htmlparser2.Parser({
            onopentag(name: string, attribs: { [p: string]: string }, isImplied: boolean) {
                switch (name) {
                    case 'groups':
                        inGroups = true
                        break
                    case 'group':
                        inGroups = true
                        group = {samples: []} as Group
                        program.groups.push(group)
                        break
                    case 'sample':
                        inSample = true
                        const sample = {} as Sample
                        group.samples.push(sample)
                        sample.path = attribs.path
                        sample.attack = Number.parseFloat(attribs.attack)
                        sample.attackCurve = Number.parseFloat(attribs.attackcurve)
                        sample.decay = Number.parseFloat(attribs.decay)
                        sample.decayCurve = Number.parseFloat(attribs.decaycurve)
                        break
                    default:
                        break
                }
            },
            onclosetag(name: string, isImplied: boolean) {
                switch (name) {
                    case 'groups':
                        inGroups = false
                        break
                    case 'group':
                        inGroup = false
                        break
                    case 'sample':
                        inSample = false
                        break
                    default:
                        break
                }
            },
            ontext(data: string) {
            }
        })
        parser.write(buf.toString())
        return program as Program
    }
}