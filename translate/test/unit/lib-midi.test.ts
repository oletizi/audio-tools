import {midiNoteToNumber} from "@/lib-midi";
import {expect} from "chai";

describe(`Map note names to midi numbers`, () => {
    it(`Calculates note numbers`, () => {
        expect(midiNoteToNumber('C0')).eq(12)
        expect(midiNoteToNumber('C#0')).eq(13)
        expect(midiNoteToNumber('Db0')).eq(13)
        expect(midiNoteToNumber('C-1')).eq(null)
    })
})