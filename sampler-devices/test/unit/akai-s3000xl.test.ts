import path from "pathe"
import {expect} from "chai";
import {newAkaitools, newAkaiToolsConfig, RAW_LEADER} from "@/client/akaitools.js";
import {tmpdir} from "node:os"
import {parseSampleHeader, SampleHeader, SampleHeader_writeSPITCH} from "@/devices/s3000xl.js";

describe(`Basic Akai S3000xl tests`, () => {
    it('Round trip read, write, read Akai format sample', async () => {
        const tools = newAkaitools(await newAkaiToolsConfig())
        const filepath = path.join('test', 'data', 's3000xl', 'chops', 'brk.10', 'brk.10.00_-l.a3s')
        let r = await tools.readAkaiData(filepath)
        expect (r.errors).to.be.empty

        const data = r.data
        const sampleHeader = {} as SampleHeader
        parseSampleHeader(data, 0, sampleHeader)
        sampleHeader.raw = new Array(RAW_LEADER).fill(0).concat(data)
        expect(sampleHeader.SPITCH).eq(60)
        SampleHeader_writeSPITCH(sampleHeader, 12)

        const outfile = path.join(tmpdir(), 'out.a3s')
        await tools.writeAkaiSample(outfile, sampleHeader)

        // read the modified sample back in and make sure it's sane
        // const lazarusData = await readAkaiData(outfile)
        r = await tools.readAkaiData(outfile)
        expect(r.errors).to.be.empty

        const lazarusData = r.data
        const lazarusSampleHeader = {} as SampleHeader
        parseSampleHeader(lazarusData, 0, lazarusSampleHeader)
        lazarusSampleHeader.raw = new Array(RAW_LEADER).fill(0).concat(data)

        expect(lazarusSampleHeader.SPITCH).eq(12)

    })
})