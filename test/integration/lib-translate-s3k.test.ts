import {chop, map} from "../../src/lib/lib-translate-s3k";
import path from "path";
import {akaiFormat, newAkaiToolsConfig} from "../../src/akaitools/akaitools";
import {expect} from "chai";
import fs from "fs/promises";

describe('Integration tests for lib-translate-s3k', async () => {

    // it(`Maps samples`, async function () {
    //     const c = await newAkaiToolsConfig()
    //     const source = path.join('test', 'data', 'auto', 'J8.01')
    //     const mapper = (v) => {
    //         return 0
    //     }
    //     map(c, mapper, {source: source, target: ""})
    // })

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
        const opts = {
            source: sourcepath,
            target: targetpath,
            prefix: prefix,
            samplesPerBeat: samplesPerBeat,
            beatsPerChop: beatsPerChop,
            wipeDisk: true
        }
        // const result = await chop(c, sourcepath, targetpath, prefix, samplesPerBeat, beatsPerChop)
        const result = await chop(c, opts)
        result.errors.forEach(e => console.error(e))
        expect(result.errors.length).eq(0)
    })
})