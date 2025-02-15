import {chop, ChopOpts} from '@/lib-translate-s3k.js';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;
import fs from 'fs/promises';
import {stub} from 'sinon';
import {AkaiToolsConfig, newAkaiToolsConfig} from "@oletizi/sampler-devices/s3k";
import {newSampleSource, Sample, SampleSource} from "@/sample.js";

describe('chop', () => {
    let statStub: any, mkdirStub: any, readFileStub: any, writefileStub: any, readdirStub: any, c: AkaiToolsConfig;

    beforeEach(async () => {
        c = await newAkaiToolsConfig();
        statStub = stub(fs, 'stat');
        mkdirStub = stub(fs, 'mkdir');
        readFileStub = stub(fs, 'readFile');
        writefileStub = stub(fs, 'writeFile');
        readdirStub = stub(fs, 'readdir');
    });

    afterEach(() => {
        statStub.restore();
        mkdirStub.restore();
        writefileStub.restore();
        readFileStub.restore();
        readdirStub.restore()
    });

    it('throws an error for invalid options (negative samplesPerBeat)', async () => {
        const opts: ChopOpts = {
            source: 'invalid.wav',
            target: '/some/dir',
            partition: 1,
            prefix: 'sample',
            samplesPerBeat: -4,
            beatsPerChop: 2,
            wipeDisk: false,
        };
        const rv = await chop({} as AkaiToolsConfig, {} as SampleSource, opts)
        expect(rv.errors.length > 0)
    });

    it('throws an error when the source is not a valid file', async () => {
        statStub.withArgs('invalid.wav').rejects(new Error("ENOENT: no such file or directory"));

        const opts: ChopOpts = {
            source: 'invalid.wav',
            target: '/some/dir',
            partition: 1,
            prefix: 'sample',
            samplesPerBeat: 4,
            beatsPerChop: 2,
            wipeDisk: false,
        };

        await expect(chop({} as AkaiToolsConfig, {} as SampleSource, opts)).to.be.eventually.rejectedWith('ENOENT: no such file or directory');
    });

    it('creates the target directory if it does not exist', async () => {
        statStub.withArgs('source.wav').resolves({isFile: () => true});
        statStub.withArgs('/some/dir').rejects(new Error("ENOENT: no such file or directory"));
        mkdirStub.resolves();

        const opts: ChopOpts = {
            source: 'source.wav',
            target: '/some/dir',
            partition: 1,
            prefix: 'sample',
            samplesPerBeat: 4,
            beatsPerChop: 1,
            wipeDisk: false,
        };

        readFileStub.resolves(Buffer.alloc(1024)); // Simulate file data

        // You can stub other functions here to emulate successful operation
        const ss = newSampleSource()
        const s: Sample = {
            getBitDepth(): number {
                return 0;
            }, getRawData(): Uint8Array {
                return new Uint8Array();
            }, getSampleData(): Float64Array {
                return new Float64Array();
            }, setRootNote(): void {
            }, to24Bit(): Sample {
                return this;
            }, to48(): Sample {
                return this;
            }, write(_buf: Buffer, _offset?: number): number {
                return 0;
            },
            getMetadata: stub().returns({sampleRate: 44100, bitDepth: 16}),
            getSampleCount: stub().returns(0),
            getChannelCount: stub().returns(2),
            getSampleRate: stub().returns(44100),
            trim: stub(),
            to441: stub(),
            to16Bit: stub(),
            writeToStream: stub()
        };
        const newSample = stub(ss, 'newSampleFromUrl')

        newSample.returns(Promise.resolve(s))
        readdirStub.resolves([]);

        const result = await chop(c, ss, opts);
        expect(result.code).to.equal(0);
        expect(mkdirStub.calledOnce).to.be.true;
    });
});