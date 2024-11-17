import {scale} from "../../src/ts/lib/lib-core";
import {expect} from "chai";

describe('Core lib', () => {
    it('scale', () => {
        expect(scale(50, 0, 100, 0, 10)).eq(5)
        expect(scale(-1, -100, 100, 0, 200)).eq(99)
    })
    it('positive slider', () => {

    })
})