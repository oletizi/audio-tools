import {scale} from "../../src/ts/lib/lib-core";
import {expect} from "chai";

describe('Core lib', () => {
    it('scale', () => {
        expect(scale(50, 0, 100, 0, 10)).eq(5)
    })
})