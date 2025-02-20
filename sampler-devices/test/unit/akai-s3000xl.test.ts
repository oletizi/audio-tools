import midi from "midi";
import {newServerOutput} from "@oletizi/sampler-lib";
import {expect} from "chai";
import {newDevice} from "@/client/client-akai-s3000xl.js";

describe(`Basic Akai S3000xl tests`, () => {
    it('Compiles', () => {
        const device = newDevice(new midi.Input(), new midi.Output(), newServerOutput())
        expect(device).exist
    })
})