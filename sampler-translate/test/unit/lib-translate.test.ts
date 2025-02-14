import {expect} from "chai";
import path from "path";
import {midiNoteToNumber} from "@/lib-midi.js"
import {
    AbstractKeygroup,
    AudioMetadata,
    AudioSource,
    description,
    mapLogicAutoSampler,
    mapProgram
} from "@/lib-translate.js";

describe('Test lib-translate exports', () => {
    it('Exports description()', () => {
        description()
    })
})

describe(`Core translator mapper tests`, async () => {
    it(`Barfs on errors`, async () => {
        const failMessage = "Should have barfed."
        try {
            // @ts-ignore
            await mapProgram(null, null)
            expect.fail(failMessage)
        } catch (e: any) {
            if (e.message === failMessage) {
                throw e
            }
        }

        try {
            // @ts-ignore
            await mapProgram(() => {
                return {} as AbstractKeygroup
                // @ts-ignore
            }, null)
            expect.fail(failMessage)
        } catch (e: any) {
            if (e.message === failMessage) {
                throw e
            }
        }
    })

    it(`Maps samples to a program`, async () => {
        const mapFunctionCalls = []

        function mapFunction(s: AudioSource[]): AbstractKeygroup[] {
            mapFunctionCalls.push(s)

            return s.map((v) => {
                return {zones: [{audioSource: v, lowNote: 0, highNote: 127}]}
            })
        }

        const source = path.join('test', 'data', 'auto', 'J8.01')
        const target = path.join('build')
        const program = await mapProgram(mapFunction, {source: source, target: target})
        expect(mapFunctionCalls.length).eq(1)
        expect(program).to.exist
        expect(program.keygroups).to.exist
        expect(program.keygroups.length).eq(13)
    })

    it(`Maps multiple Logic auto-sample output files to a set of keygroups`, async () => {
        const files = [
            "J8-QG7B.01-C1-V127.aif",
            "J8-WJ92.01-F#1-V127.aif",
            "J8-28YB.01-C2-V127.aif",
            "J8-G22P.01-F#2-V127.aif",
            "J8-OVMR.01-F#3-V127.aif",
            "J8-XTC0.01-C3-V127.aif",
            "J8-1DY0.01-C4-V127.aif",
            "J8-1DY0.01-C4-V64.aif",
            "J8-BP6I.01-F#4-V127.aif",
            "J8-GGQ0.01-C5-V127.aif",
            "J8-L5KB.01-B5-V127.aif",
            "J8-ZYRJ.01-F#5-V127.aif"]

        const sources: AudioSource[] = files.map(f => {
            const rv: AudioSource = {meta: {} as AudioMetadata, url: f}
            return rv
        })
        const keygroups = mapLogicAutoSampler(sources);
        expect(keygroups).to.exist
        expect(keygroups.length).to.eq(11)
        const kg1 = keygroups[0]
        expect(kg1).to.exist
        expect(kg1.zones).to.exist
        expect(kg1.zones.length).to.eq(1)
        const zone1 = kg1.zones[0]
        expect(zone1).to.exist
        expect(zone1.audioSource.url.endsWith(files[0]))
        expect(zone1?.lowNote).to.eq(midiNoteToNumber('C0') - 12)
        expect(zone1.highNote).eq(midiNoteToNumber('C1'))

        const k2 = keygroups[1]
        expect(k2).to.exist
        expect(k2.zones).to.exist
        expect(k2.zones.length).to.eq(1)
        const zone2 = k2.zones[0]
        expect(zone2).to.exist
        expect(zone2.lowNote).eq(midiNoteToNumber('C#1'))
        expect(zone2.highNote).eq(midiNoteToNumber('F#1'))
    })
})