import {
    wav2Akai,
    akaiFormat,
    akaiList,
    AkaiRecordType,
    akaiWrite,
    validateConfig, readAkaiData, KEYGROUP1_START_OFFSET, KEYGROUP_LENGTH, readAkaiProgram, addKeygroup, writeAkaiProgram
} from "../../src/akaitools/akaitools";
import path from "path";
import {expect} from "chai";
import fs from "fs/promises";
import {
    KeygroupHeader, KeygroupHeader_writeSNAME1,
    parseKeygroupHeader,
    parseProgramHeader,
    parseSampleHeader,
    ProgramHeader, ProgramHeader_writeGROUPS, ProgramHeader_writePRNAME,
    SampleHeader
} from "../../src/midi/devices/s3000xl";
import {byte2nibblesLE, nibbles2byte, pad} from "../../src/lib/lib-core";
import {akaiByte2String, nextByte} from "../../src/midi/akai-s3000xl";

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
        expect(listResult.errors).empty
        expect(listResult.data.length).eq(1)
        expect(listResult.data[0].type).eq(AkaiRecordType.VOLUME)

        // listing the volume should return some Akai objects
        listResult = await akaiList(newConfig(), listResult.data[0].name)
        expect(listResult.errors).empty
        expect(listResult.data.length).eq(5)
    })
    it(`Converts wav files to Akai sample format`, async () => {
        const source = path.join('test', 'data', 's3000xl', 'samples', 'kit.wav')
        const stat = await fs.stat(source)
        expect(stat.isFile())
        const targetDir = path.join('build')
        const c = newConfig()
        let result = await akaiFormat(c)
        expect(result.code).eq(0)
        expect(result.errors.length).eq(0)
        result = await wav2Akai(c, source, targetDir, 'kit'.padEnd(12, ' '))

        expect(!result.code)
        expect(result.errors).empty
    })
})


describe(`Test parsing Akai objects read by akaitools`, async () => {
    it(`Parses Akai program file`, async () => {
        const programPath = path.join('test', 'data', 's3000xl', 'instruments', 'test_program.a3p')
        const buffer = await fs.readFile(programPath)
        const data = []
        for (let i = 0; i < buffer.length; i++) {
            const nibbles = byte2nibblesLE(buffer[i])
            data.push(nibbles[0])
            data.push(nibbles[1])
        }
        let header = {} as ProgramHeader;
        parseProgramHeader(data, 1, header)
        expect(header.PRNAME).eq('TEST PROGRAM')
    })

    it(`Parses Akai sample header from file`, async () => {
        const samplePath = path.join('test', 'data', 's3000xl', 'instruments', 'sine.a3s')
        const data = await readAkaiData(samplePath);
        let header = {} as SampleHeader
        const bytesRead = parseSampleHeader(data, 0, header)
        console.log(`bytes read: ${bytesRead}`)
        console.log(`data size : ${data.length}`)
        expect(header.SHNAME).equal('SINE        ')
    })

    it(`Parses Akai program header from file`, async () => {
        const programPath = path.join('test', 'data', 's3000xl', 'instruments', 'test_4_kgs.a3p')
        const data = await readAkaiData(programPath)
        const programHeader = {} as ProgramHeader
        const bytesRead = parseProgramHeader(data, 1, programHeader)
        console.log(`bytes read: ${bytesRead}`)
        console.log(`data size : ${data.length}`)
        console.log(`Keygroup count: ${programHeader.GROUPS}`)
        expect(programHeader.PRNAME).equal('TEST 4 KGS  ')
        expect(programHeader.GROUPS).eq(4)

        const kg1 = {} as KeygroupHeader
        parseKeygroupHeader(data.slice(KEYGROUP1_START_OFFSET), 0, kg1)
        expect(kg1.SNAME1.startsWith('SINE'))

        const kg2 = {} as KeygroupHeader
        parseKeygroupHeader(data.slice(KEYGROUP1_START_OFFSET + KEYGROUP_LENGTH), 0, kg2)
        expect(kg2.SNAME1.startsWith('SQUARE'))

        const keygroups: KeygroupHeader[] = []
        for (let i = 0; i < programHeader.GROUPS; i++) {
            const kg = {} as KeygroupHeader
            parseKeygroupHeader(data.slice(KEYGROUP1_START_OFFSET + KEYGROUP_LENGTH * i), 0, kg)
            keygroups.push(kg)
        }

        expect(keygroups[0].SNAME1).eq('SINE        ')
        expect(keygroups[1].SNAME1).eq('SQUARE      ')
        expect(keygroups[2].SNAME1).eq('SAWTOOTH    ')
        expect(keygroups[3].SNAME1).eq('PULSE       ')
        // for (let i = 0; i < data.length; i += 2) {
        //
        //     const kg = {} as KeygroupHeader
        //     parseKeygroupHeader(data.slice(i), 0, kg)
        //     if (kg.SNAME1.startsWith('SQUARE')) {
        //         console.log(`Bytes read by program: ${bytesRead}`)
        //         console.log(`OFFSET               : ${i}`)
        //         break
        //     }
        // }


        // SNAM1 offset into data: 476
    })

    it(`Reads akai program files`, async () => {
        const programPath = path.join('test', 'data', 's3000xl', 'instruments', 'test_4_kgs.a3p')
        const programData = await readAkaiProgram(programPath)
        expect(programData.program.PRNAME).eq('TEST 4 KGS  ')

        const keygroups = programData.keygroups
        expect(keygroups.length).eq(4)

        expect(keygroups[0].SNAME1).eq('SINE        ')
        expect(keygroups[1].SNAME1).eq('SQUARE      ')
        expect(keygroups[2].SNAME1).eq('SAWTOOTH    ')
        expect(keygroups[3].SNAME1).eq('PULSE       ')
    })

    it(`Creates akaiprogram files`, async () => {
        const protoPath = path.join('data', 'test_program.a3p')
        const programData = await readAkaiProgram(protoPath)
        expect(programData.program.PRNAME).eq('TEST PROGRAM')
        expect(programData.keygroups.length).eq(1)
        // the number of bytes the program header starts writing to (bc it thinks its writing
        // to raw sysex data.). This should all be baked into the auto-generated parser somehow.
        const rawLeader = 7
        // const raw = new Array(rawLeader).fill(0).concat(data)
        const program = programData.program
        // program.raw = raw

        ProgramHeader_writePRNAME(program, 'SYNTHETIC')


        // const keygroup1raw = new Array(rawLeader).fill(0).concat(data.slice(KEYGROUP1_START_OFFSET))
        const keygroup1 = programData.keygroups[0]
        // keygroup1.raw = keygroup1raw

        KeygroupHeader_writeSNAME1(keygroup1, 'MODIFIED')
        const keygroup1data = keygroup1.raw.slice(rawLeader)

        const keygroup2raw = keygroup1.raw.slice()
        const keygroup2 = {} as KeygroupHeader
        keygroup2.raw = keygroup2raw
        parseKeygroupHeader(keygroup2raw.slice(rawLeader), 0, keygroup2)


        expect(keygroup2.SNAME1).eq('MODIFIED    ')
        KeygroupHeader_writeSNAME1(keygroup2, 'KEYGROUP 2')
        const keygroup2data: number[] = keygroup2raw.slice(rawLeader)

        // update GROUP count in program
        ProgramHeader_writeGROUPS(program, 2)

        // Write keygroup data
        const nibbles = program.raw.slice(rawLeader)

        for (let i = 0; i < keygroup1data.length; i++) {
            nibbles[KEYGROUP1_START_OFFSET + i] = keygroup1data[i]
        }

        for (let i=0; i<keygroup2data.length; i++) {
            // Nice that javascript automatically grows the array behind the scenes ;-)
            // But, if this *wasn't* javascript, we'd have to explicitly grow the array.
            // HOWEVER--if there is anything interesting at the end of the original program file AFTER the
            // keygroup data, this will overwrite it.
            nibbles[KEYGROUP1_START_OFFSET * 2 + i] = keygroup2data[i]
        }


        const outData = []
        for (let i = 0; i < nibbles.length; i += 2) {
            outData.push(nibbles2byte(nibbles[i], nibbles[i + 1]))
        }
        console.log(`outdata lenght: ${outData.length}`)
        const p = {} as ProgramHeader
        parseProgramHeader(nibbles, 1, p)
        expect(p.PRNAME).eq('SYNTHETIC   ')

        const outfile = path.join('build', 'synthetic.a3p')
        await fs.writeFile(outfile, Buffer.from(outData))

        const parsed = await readAkaiProgram(outfile)
        expect(parsed.program.PRNAME).eq('SYNTHETIC   ')
        expect(parsed.keygroups[0].SNAME1).eq('MODIFIED    ')
        expect(parsed.keygroups.length).eq(2)
        expect(parsed.keygroups[1].SNAME1).eq('KEYGROUP 2  ')
    })

    it(`Adds keygroups`, async ()=> {
        const protoPath = path.join('data', 'test_program.a3p')
        const p = await readAkaiProgram(protoPath)
        expect(p.program).to.exist
        expect(p.keygroups).to.exist
        expect(p.keygroups.length).eq(1)

        addKeygroup(p)
        expect(p.keygroups.length).eq(2)

        KeygroupHeader_writeSNAME1(p.keygroups[1], 'FUN TIMES')
        const outfile = path.join('build', `synthetic.${new Date().getTime()}.a3p`)
        await writeAkaiProgram(outfile, p)

        const p2 = await readAkaiProgram(outfile)
        expect(p2.keygroups[1].SNAME1).eq('FUN TIMES   ')

        await fs.rm(outfile)
    })

    it(`Finds strings in akai files`, async () => {
        const programPath = path.join('test', 'data', 's3000xl', 'instruments', 'test_program.a3p')
        const data = await readAkaiData(programPath)
        let offset = 0
        const v = {value: 0, offset: offset * 2}
        const window = []
        while (v.offset < data.length) {
            nextByte(data, v)
            window.push(v.value)
            if (window.length > 12) {
                window.shift()
            }
            // console.log(window)
            const s = akaiByte2String(window)
            console.log(`${v.offset}: ${s}`)
        }
    })
})