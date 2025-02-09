import {AudioSource, description, Keygroup, mapLogicAutoSampler, mapProgram} from "@/index"
import {expect} from "chai";
import path from "path";

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

    it(`Maps Logic auto-sample output files to a keygroup`, async () => {
        const s: AudioSource = {meta: {}, url: "file:///path/to/J8-1DY0.01-C4-V127.aif"}
        const keygroups = mapLogicAutoSampler([s])
        expect(keygroups).to.exist
        expect(keygroups.length).eq(1)

        const kg = keygroups[0]
        expect(kg).to.exist
        expect(kg.zones).to.exist
        expect(kg.zones.length).eq(1)
    })
})