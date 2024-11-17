export interface DeviceSpec {
    specName: string,
    className: string,
    sectionCode: number,
    items: any[]
}

export const programOutputSpec: DeviceSpec = {
    specName: 'programOutputSpec',
    className: "ProgramOutput",
    sectionCode: Section.PROGRAM,
    items: [
        // | general                                 | set request spec. req data length encoded in length of the spec array
        // | method name root, type spec             | item code, req data, response data type, response data length | item code, [req byte 1 (type | value), ..., req byte n (type | value) ]
        // |                   'number|min|max|step" |
        // |                   'string|max'          |
        ["Loudness", "number|0|100|1", 0x28, [], "uint8", 1, 0x20, ["uint8"]],
        ["VelocitySensitivity", "number|-100|100|1", 0x29, [], "uint8", 1, 0x21, ["int8sign", "int8abs"]],
        ["AmpMod1Source", "number|0|14|1", 0x2A, [1], "uint8", 1, 0x22, [1, "uint8"]],
        ["AmpMod2Source", "number|0|14|1", 0x2A, [2], "uint8", 1, 0x22, [2, "uint8"]],
        ["AmpMod1Value", "number|-100|100|1", 0x2B, [1], "int8", 2, 0x23, [1, "int8sign", "int8abs"]],
        ["AmpMod2Value", "number|-100|100|1", 0x2B, [2], "int8", 2, 0x23, [2, "int8sign", "int8abs"]],
        ["PanMod1Source", "number|0|14|1", 0x2C, [1], "uint8", 1, 0x24, [1, "uint8"]],
        ["PanMod2Source", "number|0|14|1", 0x2C, [2], "uint8", 1, 0x24, [2, "uint8"]],
        ["PanMod3source", "number|0|14|1", 0x2C, [3], "uint8", 1, 0x24, [3, "uint8"]],
        ["PanMod1Value", "number|-100|100|1", 0x2D, [1], "int8", 2, 0x25, [1, "int8sign", "int8abs"]],
        ["PanMod2Value", "number|-100|100|1", 0x2D, [2], "int8", 2, 0x25, [2, "int8sign", "int8abs"]],
        ["PanMod3Value", "number|-100|100|1", 0x2D, [3], "int8", 2, 0x25, [3, "int8sign", "int8abs"]],
    ]
}
export function getDeviceSpecs(): DeviceSpec[] {
    return [
        programOutputSpec,
        // programMidTuneSpec,
        // programPitchBendSpec,
        // programLfosSpec
    ]
}
enum Section {
    SYSEX_CONFIG = 0x00,
    SYSTEM_SETUP = 0x02,
    MIDI_CONFIG = 0x04,
    KEYGROUP_ZONE = 0x06,
    KEYGROUP = 0x08,
    PROGRAM = 0x0A,
    MULTI = 0x0C,
    SAMPLE_TOOLS = 0x0E,
    DISK_TOOLS = 0x10,
    FX = 0x12,
    SCENLIST = 0x14,
    SONGFILE = 0x16,
    FRONT_PANEL = 0x20,
    ALT_PROGRAM = 0x2A,
    ALT_MULTI = 0x2C,
    ALT_SAMPLE = 0x2E,
    ALT_FX = 0x32
}