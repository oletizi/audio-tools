import {AudioSource, description, Keygroup, mapProgram} from "@/index"
import {expect} from "chai";
import path from "path";

describe('Test lib-translate exports', () => {
    it ('Exports description()', () => {
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

        function mapFunction(s: AudioSource): Keygroup {
            mapFunctionCalls.push(s)
            return {} as Keygroup
        }


        const source = path.join('test', 'data', 'auto', 'J8.01')
        const target = path.join('build')
        await mapProgram(mapFunction, {source: source, target: target})
        expect(mapFunctionCalls.length).eq(11)
        // expect(program).to.exist
        // expect(program.keygroups).to.exist
        // expect(program.keygroups.length).eq(11)
    })
})