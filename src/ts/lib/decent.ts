import * as htmlparser2 from "htmlparser2";

export namespace decent {
    interface Sample {
        volume: string
        sustain: number
        start: number
        rootNote: number
        releaseCurve: number
        release: number
        pitchKeyTrack: number
        pan: number
        loVel: number
        loNote: number
        hiVel: number
        hiNote: number
        end: number
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
                        sample.end = Number.parseFloat(attribs.end)
                        sample.hiNote = Number.parseInt(attribs.hinote)
                        sample.hiVel = Number.parseInt(attribs.hivel)
                        sample.loNote = Number.parseInt(attribs.lonote)
                        sample.loVel = Number.parseInt(attribs.lovel)
                        sample.pan = Number.parseFloat(attribs.pan)
                        sample.pitchKeyTrack = Number.parseFloat(attribs.pitchkeytrack)
                        sample.release = Number.parseFloat(attribs.release)
                        sample.releaseCurve = Number.parseFloat(attribs.releasecurve)
                        sample.rootNote = Number.parseInt(attribs.rootnote)
                        sample.start = Number.parseFloat(attribs.start)
                        sample.sustain = Number.parseFloat(attribs.sustain)
                        sample.volume = attribs.volume
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