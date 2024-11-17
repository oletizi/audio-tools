import {natural2real, real2natural, scale} from "../../src/ts/lib/lib-core";
import {expect} from "chai";

describe('Core lib', () => {
    it('scale', () => {
        expect(scale(50, 0, 100, 0, 10)).eq(5)
        expect(scale(-1, -100, 100, 0, 200)).eq(99)
    })
    it('real2natural', () => {
        expect(real2natural(0, -100, 100)).eq(100)
    })
    it('natural2real', () =>{
        expect(natural2real(100, -100, 100)).eq(0)
        expect(natural2real(100, -50, 100)).eq(50)
    })
})