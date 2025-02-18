import {chop, ChopOpts} from '@/lib-translate-s3k.js';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;
import fsp from 'fs/promises';
import fs from 'fs'
import {stub} from 'sinon';
import {newAkaiToolsConfig, newAkaitools, Akaitools} from "@oletizi/sampler-devices/s3k";
import {newSampleSource, Sample, SampleSource} from "@/sample.js";
import {newServerConfig, ServerConfig} from "@oletizi/sampler-lib";
import {ExecutionResult} from "@oletizi/sampler-devices";

describe('chop error conditions', () => {
    let statStub: any, mkdirStub: any, readFileStub: any, writefileStub: any, readdirStub: any

    beforeEach(async () => {
        statStub = stub(fsp, 'stat');
        mkdirStub = stub(fsp, 'mkdir');
        readFileStub = stub(fsp, 'readFile');
        writefileStub = stub(fsp, 'writeFile');
        readdirStub = stub(fsp, 'readdir');
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
        const rv = await chop({} as ServerConfig, {} as Akaitools, {} as SampleSource, opts)
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

        await expect(chop({} as ServerConfig, {} as Akaitools, {} as SampleSource, opts)).to.be.eventually.rejectedWith('ENOENT: no such file or directory');
    });
})

describe(`chop happy path`, async () => {

    it('chops', async () => {
        // XXX: This is still super messy.
        const targetDir = '/some/dir';
        const samplesPerBeat = 1
        const beatsPerChop = 10
        const sampleCount = 100

        let statStub: any, mkdirStub: any, readFileStub: any, readdirStub: any, createWriteStreamStub: any
        statStub = stub(fsp, 'stat')
        mkdirStub = stub(fsp, 'mkdir')
        readFileStub = stub(fsp, 'readFile')
        readdirStub = stub(fsp, 'readdir')
        createWriteStreamStub = stub(fs, 'createWriteStream')

        statStub.withArgs('source.wav').resolves({isFile: () => true})
        statStub.withArgs(targetDir).onCall(0).rejects(new Error("ENOENT: no such file or directory"))
        statStub.withArgs(targetDir).onCall(1).resolves({isFile: () => false})
        mkdirStub.resolves();
        createWriteStreamStub.returns({write: () => true})

        const opts: ChopOpts = {
            source: 'source.wav',
            target: targetDir,
            partition: 1,
            prefix: 'sample',
            samplesPerBeat: samplesPerBeat,
            beatsPerChop: beatsPerChop,
            wipeDisk: false,
        };

        readFileStub.resolves(Buffer.alloc(1024)); // Simulate file data

        // You can stub other functions here to emulate successful operation

        const to16BitStub = stub()
        const to441Stub = stub()
        const trimStub = stub()
        const writeToStreamStub = stub()
        const s: Sample = {
            getBitDepth(): number {
                return 24;
            }, getRawData(): Uint8Array {
                return new Uint8Array(sampleCount);
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
            getMetadata: stub().returns({sampleRate: 48000, bitDepth: 24}),
            getSampleCount: stub().returns(sampleCount),
            getChannelCount: stub().returns(2),
            getSampleRate: stub().returns(44100),
            trim: trimStub,
            to441: to441Stub,
            to16Bit: to16BitStub,
            writeToStream: writeToStreamStub,
        };
        trimStub.returns(s)
        to441Stub.resolves(s)
        to16BitStub.resolves(s)
        writeToStreamStub.resolves()

        const ss = newSampleSource()
        stub(ss, 'newSampleFromUrl').resolves(s);

        readdirStub.resolves([]);
        const cfg = await newServerConfig()
        const c = await newAkaiToolsConfig()
        const tools = newAkaitools(c)
        stub(tools, 'writeAkaiProgram').resolves()
        stub(tools, 'wav2Akai').resolves({errors: [], code: 0} as ExecutionResult)
        stub(tools, 'akaiWrite').resolves({errors: [], code: 0} as ExecutionResult)

        const result = await chop(cfg, tools, ss, opts)

        const mkdirArgs = []
        for (const call of mkdirStub.getCalls()) {
            mkdirArgs.push(call.args[0])
        }
        expect(mkdirArgs.includes('/some/dir'))

        expect(to16BitStub.callCount).to.equal(1)
        expect(to441Stub.callCount).to.equal(1)
        expect(trimStub.callCount).to.equal(sampleCount / (samplesPerBeat * beatsPerChop))

        expect(result.code).to.equal(0);

        expect(createWriteStreamStub.callCount).to.equal(10)
    });
});