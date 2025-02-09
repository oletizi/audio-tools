import {AudioMetadata, AudioSource, description, Keygroup, mapLogicAutoSampler, mapProgram, Zone} from "@/index"
import {expect} from "chai";
import path from "path";
import {midiNoteToNumber} from "@/lib-midi";

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
                return {} as Keygroup
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

        function mapFunction(s: AudioSource[]): Keygroup[] {
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
        expect(program.keygroups.length).eq(12)
    })

    it(`Maps Logic auto-sample output file to a keygroup`, async () => {
        const s: AudioSource = {meta: {}, url: "file:///path/to/J8-1DY0.01-C4-V127.aif"}
        const keygroups = mapLogicAutoSampler([s])
        expect(keygroups, 'keygroups should exist').to.exist
        expect(keygroups.length, 'there should be one keygroup').eq(1)

        const kg = keygroups[0]
        expect(kg).to.exist
        expect(kg.zones).to.exist
        expect(kg.zones.length).eq(1)
        const zone: Zone = kg.zones[0]
        expect(zone).exist
        expect(zone.audioSource).exist
        expect(zone.audioSource).eq(s)
        expect(zone.lowNote).eq(0)
        expect(zone.highNote).eq(127)
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
        expect(zone1.lowNote).eq(midiNoteToNumber('C0') - 12)
        // expect(zone1.highNote).eq(midiNoteToNumber('F1'))

    })
})