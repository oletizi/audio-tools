import {newSequence, timestamp} from "@/lib-core";
import {expect} from "chai";

describe(`Core library functions`, () => {
    it(`Returns an incrementing sequence`, () => {
        const base = 'the base'
        const sequence = newSequence(base)
        const s1 = sequence()
        const s2 = sequence()

        expect(s1).not.eq(s2)
        expect(s1.startsWith(base))
        expect(s1.endsWith("0"))
        expect(s2.startsWith(base))
        expect(s2.endsWith("1"))
    })

    it(`Returns a timestamp`,() => {
        const t1 = timestamp()
        const t2 = timestamp()
        expect(t1).exist
        expect(t1).not.eq(t2)
    })
})