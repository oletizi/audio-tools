import path from "path";
import {expect} from "chai";
import {Brain} from "@/app/brain";

describe('Brain', async () => {
    it('Returns a list of files in the from and to directories', async () => {
        const theBrain = new Brain(path.join('test', 'data', 'mpc'), '/tmp')
        let lists = await theBrain.list()
        expect(lists.length).gte(2)

        let fromList = lists[0]
        expect(fromList).to.exist
        expect(fromList.entries.length).gte(2)

        // check first entry
        let entry = fromList.entries[0]
        expect(entry.name).to.eq('..')
        expect(entry.directory).to.be.true

        // check second entry
        entry = fromList.entries[2]
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

    it('Calculates breadcrumbs', async () => {
        const theBrain = new Brain(path.join('test', 'data', 'mpc'), '/tmp')

        let lists = await theBrain.list()
        let fromList = lists[0]
        expect(fromList.breadcrumb).to.exist
        expect(fromList.breadcrumb).to.eq('')

        await theBrain.cdFromDir('Oscar')
        fromList = (await theBrain.list())[0]
        expect(fromList.breadcrumb).to.eq('/Oscar')
    })
})