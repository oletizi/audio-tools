import {getSamples} from "../src/ts/decent";
import {expect} from "chai";

describe('Decent Sampler parsing', async ()=> {
    it ('Parses a Decent Sampler preset', async () => {
        let presetFile = 'test/data/decent/Oscar.dspreset';
        const samples = await getSamples(presetFile)
        expect(samples).to.exist
        expect(samples.length).to.eq(16)
    })

})