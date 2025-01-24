import {akaiFormat, akaiList, AkaiRecordType, akaiWrite, validateConfig} from "../../src/akaitools/akaitools";
import path from "path";
import {expect} from "chai";
import fs from "fs/promises";

describe('Test interaction w/ akaitools and akai files.', async () => {
    let diskFile = ""
    beforeEach(() => {
        diskFile = path.join('build', `akai.${new Date().getTime()}.img`)
    })

    afterEach(() => {
        fs.rm(diskFile).then().catch(() => {
        })
    })

    function newConfig() {
        return {
            akaiToolsPath: path.join('..', 'akaitools-1.5'),
            diskFile: diskFile
        }
    }

    it('Validates config', async () => {
        expect(await validateConfig(newConfig()))
    })

    it(`Formats an Akai disk image`, async function () {
        const c = newConfig()
        let result = await akaiFormat(c)
        result.errors.forEach(e => console.error(e))
        expect(result.errors.length).eq(0)
        expect(result.code).eq(0)
    })

    it(`Writes to an Akai disk image and lists its contents`, async function () {
        const c = newConfig()
        let result = await akaiFormat(c)
        expect(result.code).eq(0)
        expect(result.errors.length).eq(0)

        for (const n of ['saw.a3p', 'sawtooth.a3s', 'sine.a3s', 'square.a3s', 'test_program.a3p']) {
            const file = path.join('test', 'data', 's3000xl', 'instruments', n)
            const s = await fs.stat(file)
            expect(s.isFile())
            result = await akaiWrite(c, file, `/VOLUME 1/`)
            expect(result.code).eq(0)
            expect(result.errors.length).eq(0)
        }

        let listResult = await akaiList(newConfig())
        for (const e of listResult.errors) {
            console.error(e)
        }

        // the first entry should be a volume
        expect(listResult.errors.length).eq(0)
        expect(listResult.data.length).eq(1)
        expect(listResult.data[0].type).eq(AkaiRecordType.VOLUME)

        // listing the volume should return some Akai objects
        listResult = await akaiList(newConfig(), listResult.data[0].name)
        expect(listResult.errors.length).eq(0)
        expect(listResult.data.length).eq(5)
    })
})