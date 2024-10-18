import fs from "fs/promises";

import {mpc} from "../src/ts/akai-mpc";
import {expect} from "chai";
import Layer = mpc.Layer;

describe('MPC', async () => {
    it('Parses an MPC program', async () => {
        const buf = await fs.readFile('test/data/akai/Oscar/Oscar.xpm')
        const program = mpc.newProgramFromBuffer(buf)
        expect(program).to.exist
        expect(program.programName).to.eq('Oscar')
        expect(program.layers).to.exist
        expect(program.layers.length).to.eq(16)
        const layer: Layer = program.layers[0]
        expect(layer.number).to.eq(1)
        expect(layer.sampleName).to.eq('Oscar')
        expect(layer.sliceStart).to.eq(0)
        expect(layer.sliceEnd).to.eq(133300)
    })
})