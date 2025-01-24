import {akaiList, AkaiRecordType, validateConfig} from "../../src/akaitools/akaitools";
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
        let result = await akaiList(newConfig())
        for (const e of result.errors) {
            console.error(e)
        }

        // the first entry should be a volume
        expect(result.errors.length).eq(0)
        expect(result.data.length).eq(1)
        expect(result.data[0].type).eq(AkaiRecordType.VOLUME)

        // listing the volume should return some Akai objects
        result = await akaiList(newConfig(), result.data[0].name)
        expect(result.errors.length).eq(0)
        expect(result.data.length).eq(5)
    })
})