import {akaiFormat, akaiList, AkaiRecordType, validateConfig} from "../../src/akaitools/akaitools";
import path from "path";
import {expect} from "chai";
import fs from "fs/promises";

describe('Test interaction w/ akaitools and akai files.', async () => {
    function newConfig() {
        return {
            akaiToolsPath: path.join('..', 'akaitools-1.5'),
            diskFile: path.join('test', 'data', 's3000xl', 'akai.img')
            // diskFile: path.join('build', `akai.test.${new Date().getTime()}.img`)
        }
    }

    it('Validates config', async () => {
        expect(await validateConfig(newConfig()))
    })

    it(`Formats an Akai disk image`, async function() {
        this.timeout(5 * 1000)
        const c = newConfig()
        let result = await akaiFormat(c)
        result.errors.forEach(e=> console.error(e))
        await fs.rm(c.diskFile)
        expect(result.errors.length).eq(0)
        expect(result.code).eq(0)
    })

    it(`Lists an Akai disk image`, async function () {
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