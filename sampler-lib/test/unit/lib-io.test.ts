import {newStreamOutput} from "@/lib-io";
import {expect} from "chai";

describe(`Input output functions`, () => {
    it(`stream output`, () => {
        const stdoutWrites = []
        const stdout = {
            write: (v) => {
                stdoutWrites.push(v)
            }
        }

        const stderrWrites = []
        const stderr = {
            write: (v) => {
                stderrWrites.push(v)
            }
        }

        const out = newStreamOutput(stdout, stderr)
        expect(out).to.exist

        expect(stdoutWrites.length).eq(0)
        out.log(`Test`)
        expect(stdoutWrites[0].endsWith('Test\n'))

        out.write(`Test 2`)
        expect(stdoutWrites[1].endsWith('Test 2'))

        expect(stderrWrites.length).eq(0)
        out.error('Error')
        expect(stderrWrites[0].endsWith('Error'))


    })
})