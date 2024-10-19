import {brain} from "../src/ts/app/brain";
import path from "path";
import {expect} from "chai";

describe('Brain', async () => {
    it('Constructs a from list', async () =>{
        const theBrain = new brain.Brain(path.join('test', 'data', 'mpc'))
        let fromList = await theBrain.getFromList();
        expect(fromList).to.exist
        expect(fromList.entries.length).to.eq(1)

        let entry = fromList.entries[0]
        expect(entry.name).to.eq('Oscar')
        expect(entry.directory).to.be.true

        theBrain.cd('Oscar')
        fromList = await theBrain.getFromList()
        expect(fromList).to.exist
        expect(fromList.entries.length).to.eq(4)
        entry = fromList.entries[0]
        expect(entry.name).to.eq('Oscar.WAV')
        expect(entry.directory).to.be.false
    })
})