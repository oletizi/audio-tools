import {akaiList, validateConfig} from "../../src/akaitools/akaitools";
import path from "path";
import {expect} from "chai";

describe('Test interaction w/ akaitools and akai files.', async () => {
    function newConfig() {
        return {
            akaiToolsPath: path.join('..', 'akaitools-1.5'),
            diskFile: path.join('test', 'data', 's3000xl', 'akai.img')
        }
    }

    it('Validates config', async () => {
        expect(await validateConfig(newConfig()))
    })

    it(`Lists an Akai disk image`, async function () {
        this.timeout(12 * 1000)
        let result = await akaiList(newConfig(), 'VOLUME 1')
        for (const e of result.errors) {
            console.error(e)
        }
        expect(result.errors.length).eq(0)
        expect(result.data.length).eq(5)
    })
})