import {chop} from "../../src/lib/lib-translate-s3k";
import path from "path";
import {akaiFormat, newAkaiToolsConfig} from "../../src/akaitools/akaitools";
import {expect} from "chai";
import fs from "fs/promises";

describe('Integration tests for lib-translate-s3k', async () => {
    it(`Chops samples`, async function () {
        this.timeout(5000)
        const c = await newAkaiToolsConfig()
        const root = path.join('build', 'chop')
        try {
            await fs.rmdir(root)
        } catch (e) {
        }

        await fs.mkdir(root, {recursive: true})

        c.diskFile = path.join(root, `akai-${new Date().getTime()}.img`)
        await akaiFormat(c, 10)

        const sourcepath = path.join('test', 'data', 's3000xl', 'chops', 'loop96.wav')
        const targetpath = path.join('build', 'chop')
        const prefix = 'loop96'
        const samplesPerBeat = 27563
        const beatsPerChop = 4
        const result = await chop(c, sourcepath, targetpath, prefix, samplesPerBeat, beatsPerChop)
        result.errors.forEach(e => console.error(e))
        expect(result.errors.length).eq(0)
    })
})