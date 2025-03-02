import {chop, ChopOpts, newDefaultTranslateContext, ProgramOpts} from '@/lib-translate-s3k.js';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
const expect = chai.expect;
import fsp from 'fs/promises';
import fs from 'fs'
import {stub} from 'sinon';
import {
    newAkaiToolsConfig,
    newAkaitools,
    Akaitools,
    Keygroup,
    Device,
    KeygroupHeader, AkaiProgramFileResult
} from "@oletizi/sampler-devices/s3k";
import {newServerConfig, ServerConfig} from "@oletizi/sampler-lib";
import {ExecutionResult} from "@oletizi/sampler-devices";
import {newDefaultSampleFactory, Sample} from "@/sample.js";
import {map} from "@/lib-translate-s3k.js"
import {
    fileio,
    AudioFactory,
    AudioTranslate, AudioMetadata, AudioSource, MapProgramResult
} from "@/lib-translate.js";
import {afterEach} from "mocha";

describe('translate context', async () => {
    it('creates a default translate context', async () => {
        const ctx = await newDefaultTranslateContext();
        expect(ctx).to.exist
    })
    it(`resolves path to default s3k programs for keygroup count 1-20; and, those default program files exist.`, async () => {
        const ctx = await newDefaultTranslateContext();
        for (let i = 1; i < 21; i++) {
            let path = await ctx.getS3kDefaultProgramPath(i)
            expect(path).to.exist
            await fsp.stat(path)
        }
    })
})

describe(`map`,
    async () => {
        // mapProgram stubs
        let mapProgramResult: MapProgramResult,
            mapProgramFunctionStub: any

        let audioFactory: AudioFactory,
            audioSource: AudioSource,
            akaiTools: any,
            wav2AkaiStub: any,
            readAkaiProgramStub: any,
            akaiFormatStub: any,
            akaiProgramFile: any,
            akaiProgramFileResult: any,
            writeAkaiDataStub: any,
            writeAkaiSampleStub: any,
            writeAkaiProgramStub: any,
            akaiWriteStub: any,
            program: any,
            keygroups: any,
            keygroup: Keygroup,
            setSampleFactory: any,
            setProgramNameStub: any,
            setSampleName1Stub: any,
            setLowNoteStub: any,
            setHighNoteStub: any,
            setLowVelocity1Stub: any,
            setHighVelocity1Stub: any,
            ctx: any,

            getS3kDefaultProgramPathStub: any,
            readAkaiDataStub: any,
            byteArrayResult: any,
            mapFunctionStub: any,
            options: ProgramOpts,
            loadFromFileStub: any,
            meta: AudioMetadata,
            audioTranslate: AudioTranslate,
            translateStub: any,
            abstractZone: any,
            abstractKeygroups: any,
            abstractKeygroup: any,
            successResult: any

        beforeEach(async () => {

            // Translate context stubs
            audioTranslate = {
                translate: translateStub = stub(),
            }
            audioFactory = {
                // @ts-ignore
                loadFromFile: loadFromFileStub = stub()
            }

            // Akaitools stubs

            akaiTools = {
                akaiFormat: akaiFormatStub = stub(),
                wav2Akai: wav2AkaiStub = stub(),
                readAkaiProgram: readAkaiProgramStub = stub(),
                readAkaiData: readAkaiDataStub = stub(),
                writeAkaiSample: writeAkaiSampleStub = stub(),
                akaiWrite: akaiWriteStub = stub(),
                writeAkaiProgram: writeAkaiProgramStub = stub(),
            }

            ctx = {
                mapProgramFunction: mapProgramFunctionStub = stub(),
                getS3kDefaultProgramPath: getS3kDefaultProgramPathStub = stub(),
                audioTranslate: audioTranslate,
                akaiTools: akaiTools,
                audioFactory: audioFactory,
            }

            // Abstract program stubs

            meta = {
                channelCount: 2
            }

            audioSource = {
                filepath: "",
                getSample: () => {
                    return Promise.resolve({} as Sample);
                },
                meta: meta
            }

            loadFromFileStub.resolves(audioSource)

            abstractZone = {
                audioSource: audioSource,
                lowNote: 0,
                highNote: 0,
                highVelocity: 127,
                lowVelocity: 0,
                centerNote: 60
            }

            abstractKeygroup = {
                zones: [abstractZone]
            }
            abstractKeygroups = [abstractKeygroup]

            mapProgramResult = {data: abstractKeygroups, errors: []}
            mapProgramFunctionStub.resolves(mapProgramResult)
            mapFunctionStub = stub()

            mapFunctionStub.returns(abstractKeygroups)

            byteArrayResult = {
                data: [],
                errors: []
            }
            readAkaiDataStub.resolves(byteArrayResult)

            program = {
                setProgramName: setProgramNameStub = stub()
            }

            keygroup = new Keygroup({} as Device, {} as KeygroupHeader)
            setSampleName1Stub = stub(keygroup, 'setSampleName1')
            setLowNoteStub = stub(keygroup, 'setLowNote')
            setHighNoteStub = stub(keygroup, 'setHighNote')
            setLowVelocity1Stub = stub(keygroup, 'setLowVelocity1')
            setHighVelocity1Stub = stub(keygroup, 'setHighVelocity1')
            akaiProgramFile = {
                program: program,
                keygroups: keygroups = [keygroup]
            }
            akaiProgramFileResult = {
                errors: [],
                data: akaiProgramFile
            }

            options = {
                partition: 0,
                wipeDisk: false,
                source: "/path/to/source",
                target: "/path/to/target",
                prefix: "prefix"
            }

            successResult = {
                errors: [],
                code: 0
            }

            translateStub.resolves(successResult)
            wav2AkaiStub.resolves(successResult)
            readAkaiProgramStub.resolves(akaiProgramFileResult)
            akaiWriteStub.resolves(successResult)

        })

        afterEach(async () => {
            // fsStub.restore()
            // audioFactoryStub.restore()
            // mapFunctionStub.restore()
            // sourceStub.restore()
            // targetStub.restore()
        })

        const e = new Error(`A nice error.`);
        it(`handles errors from underlying map() function`, async () => {
            const mapFunction: any = stub()
            mapProgramResult.errors.push(e)
            mapProgramFunctionStub.resolves(mapProgramResult)
            let r = await map(ctx, mapFunction, options)
            expect(r).exist
            expect(r.errors).to.exist
            expect(r.errors).not.to.be.empty
        })

        it(`handles empty result from underlying map() function`, async () => {
            mapProgramFunctionStub.resolves(null)
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).not.to.be.empty
        })

        it(`handles audioTranslate.translate errors`, async () => {
            const e = new Error(`A nice error.`);
            let errorExecutionResult : ExecutionResult = {code: -1, errors: [e]}
            translateStub.resolves(errorExecutionResult)
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).to.include(e)
        })

        it(`handles wav2Akai errors`, async () => {
            const e = new Error(`A nice error.`);
            let errorExecutionResult : ExecutionResult = {code: -1, errors: [e]}
            wav2AkaiStub.resolves(errorExecutionResult)
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).to.include(e)
        })

        it(`handles readAkaiProgram errors`, async () => {
            const e = new Error(`A nice error.`);
            let errorExecutionResult : AkaiProgramFileResult = {data: undefined, errors: [e]}
            readAkaiProgramStub.resolves(errorExecutionResult)
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).to.include(e)
        })

        it(`handles readAkaiData errors`, async () => {
            const e = new Error(`A nice error.`);
            readAkaiDataStub.resolves({data: undefined, errors: [e]})
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).to.include(e)
        })

        it(`handles mismatch between abstract keygroup count and default akai program keygroup count`, async () => {
            akaiProgramFile.keygroups.length = 0
            const r = await map(ctx, stub(), options)
            expect(r.errors).to.exist
            expect(r.errors).not.to.be.empty
        })

        it(`Formats (or not) the akai disk based on options`, async () => {
            options.wipeDisk = false
            const r = await map(ctx, mapFunctionStub, options)
            expect(r.errors).to.be.empty
            expect(akaiFormatStub.callCount).to.equal(0)

            options.wipeDisk = true
            await map(ctx, mapFunctionStub, options)
            expect(akaiFormatStub.callCount).to.equal(1)
        })

        it(`handles stereo`, async () => {

            const r = await map(ctx, mapFunctionStub, options)
            expect(r.errors).to.be.empty
        })

        it(`map happy path`, async () => {
            expect(ctx.audioFactory).exist

            const result = await map(ctx, mapFunctionStub, options)
            for (const e of result.errors) {
                console.error(e)
            }
            expect(result.errors.length).to.equal(0)
            expect(result.data && result.data.length > 0)

            const kgs = result.data
            expect(kgs).to.deep.equal(abstractKeygroups)

            // Ensure wav2Akai was called for each abstract keygroup
            expect(akaiTools.wav2Akai.callCount).to.equal(abstractKeygroups.length)

            // Ensure the program name was set to options.prefix
            expect(setProgramNameStub.callCount).to.equal(1)
            expect(setProgramNameStub.getCall(0).args[0]).to.eq(options.prefix)
        })
    })

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
        const rv = await chop({} as ServerConfig, {} as Akaitools, opts)
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

        await expect(chop({} as ServerConfig, {} as Akaitools, opts)).to.be.eventually.rejectedWith('ENOENT: no such file or directory');
    });
})

describe(`chop happy path`, async () => {

    let statStub: any, mkdirStub: any, readFileStub: any, readdirStub: any, createWriteStreamStub: any
    beforeEach(async () => {
        statStub = stub(fsp, 'stat')
        mkdirStub = stub(fsp, 'mkdir')
        readFileStub = stub(fsp, 'readFile')
        readdirStub = stub(fsp, 'readdir')
    });

    afterEach(() => {
        statStub.restore();
        mkdirStub.restore();
        readFileStub.restore();
        readdirStub.restore()
    });

    it('chops', async () => {
        expect.fail(`TODO: Fix me.`)
        // XXX: This is still super messy.
        const targetDir = '/some/dir';
        const samplesPerBeat = 1
        const beatsPerChop = 10
        const sampleCount = 100

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

        readdirStub.resolves([]);
        const cfg = await newServerConfig()
        const c = await newAkaiToolsConfig()
        const tools = newAkaitools(c)
        const sampleFactory = newDefaultSampleFactory()
        stub(tools, 'writeAkaiProgram').resolves()
        stub(tools, 'wav2Akai').resolves({errors: [], code: 0} as ExecutionResult)
        stub(tools, 'akaiWrite').resolves({errors: [], code: 0} as ExecutionResult)
        stub(sampleFactory, 'newSampleFromFile').resolves(s)

        const result = await chop(cfg, tools, opts, sampleFactory)

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