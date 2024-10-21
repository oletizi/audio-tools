import {brain} from "../src/ts/app/brain";
import path from "path";
import {expect} from "chai";

describe('Brain', async () => {
    it('Returns a list of files in the from and to directories', async () => {
        const theBrain = new brain.Brain(path.join('test', 'data', 'mpc'), '/tmp')
        let lists = await theBrain.list()
        expect(lists.length).to.eq(2)

        let fromList = lists[0]
        expect(fromList).to.exist
        expect(fromList.entries.length).to.eq(2)

        // check first entry
        let entry = fromList.entries[0]
        expect(entry.name).to.eq('..')
        expect(entry.directory).to.be.true

        // check second entry
        entry = fromList.entries[1]
        expect(entry.name).to.eq('Oscar')

        // change directories
        await theBrain.cdFromDir('Oscar')

        // check the first entry
        fromList = (await theBrain.list())[0]
        expect(fromList).to.exist
        expect(fromList.entries.length).to.eq(5)

        // check the second entry
        entry = fromList.entries[1]
        expect(entry.name).to.eq('Oscar.WAV')
        expect(entry.directory).to.be.false
    })


})