
const OFFSET_HEADER = 0
const OFFSET_PROGRAM = 0x14

export function writeHeaderChunk(buf) {
    buf.set([
        0x52, 0x49, 0x46, 0x46, // 'RIFF'
        0x00, 0x00, 0x00, 0x00, //  0
        0x41, 0x50, 0x52, 0x47, // 'APRG'
        0x70, 0x72, 0x67, 0x20, // 'prg '
        0x06, 0x00, 0x00, 0x00, //  6
    ], OFFSET_HEADER)
}

export function writeProgramChunk(buf, programNumber = 0, keygroupCount = 0x1) {
    buf.set([
        0x02, programNumber, keygroupCount, 0x00,
        0x02, 0x01,
        0x6f, 0x75, 0x74, 0x20, // 'out '
        0x08, 0x00, 0x00, 0x00  //  8
    ], OFFSET_PROGRAM)
}

export function writeOutputChunk(buf, vals = {
    loudness: 85,
    ampMod1: 0,
    ampMod2: 0,
    panMod1: 0,
    panMod2: 0,
    panMod3: 0,
    velocitySensitivity: 25
}) {

}