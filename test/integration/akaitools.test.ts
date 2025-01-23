import {AkaiToolsConfig, validateConfig} from "../../src/akaitools/akaitools";
import path from "path";
import {expect} from "chai";
import fs from "fs/promises";

describe('Test interaction w/ akaitools and akai files.', async () => {
    it('Validates config', async () => {
        const config: AkaiToolsConfig = {
            akaiToolsPath: path.join('..', 'akaitools-1.5'),
            diskFile: path.join('test', 'data', 's3000xl', 'akai.img')
        }
        expect(await validateConfig(config)).true
    })
})