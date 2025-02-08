import {Keygroup, mapProgram} from "@/lib/lib-translate-core";
import {Sample} from "@/model/sample";
import {expect} from "chai";
import path from "path";

describe(`Core translator mapper tests`, async () => {
    it(`Barfs on errors`, async () => {
        const failMessage = "Should have barfed."
        try {
            await mapProgram(null, null)
            expect.fail(failMessage)
        } catch (e) {
            if (e.message === failMessage) {
                throw e
            }
        }

        try {
            await mapProgram((s) => {
                return {} as Keygroup
            }, null)
            expect.fail(failMessage)
        } catch (e) {
            if (e.message === failMessage) {
                throw e
            }
        }
    })

    it(`Maps samples to a program`, async () => {
        const mapFunctionCalls = []

        function mapFunction(s: Sample): Keygroup {
            mapFunctionCalls.push(s)
            return {} as Keygroup
        }


        const source = path.join('test', 'data', 'auto', 'J8.01')
        const target = path.join('build')
        const program = await mapProgram(mapFunction, {source: source, target: target})
        expect(mapFunctionCalls.length).eq(11)
        // expect(program).to.exist
        // expect(program.keygroups).to.exist
        // expect(program.keygroups.length).eq(11)
    })
})