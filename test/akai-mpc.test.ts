import fs from "fs/promises";

import {mpc} from "../src/ts/akai-mpc";
import {expect} from "chai";

describe('MPC', async ()=> {
    it('Parses an MPC program', async () => {
        const buf = await fs.readFile('test/data/akai/Oscar/Oscar.xpm')
        const program = mpc.newProgramFromBuffer(buf)
        expect(program).to.exist
        expect(program.layers).to.exist
        expect(program.layers.length).to.eq(16)
    })
})