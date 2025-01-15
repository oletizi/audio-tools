import * as midi from 'midi'

export interface Device {

    getSampleNames(names: any[]): void;

}


export interface SampleHeader {

}

export function newDevice(input: midi.Input, output: midi.Output): Device {
    return new s3000xl(input, output)
}

// 0x27 Request for Program Header bytes
// 0x28 Program Header bytes
// 0x29 Request for Keygroup Header bytes
// 0x2A Keygroup Header bytes
// 0x2B Request for Sample Header bytes
// 0x2C Sample Header bytes
// 0x2D Request for FX/Reverb bytes
// 0x2E FX/Reverb bytes
// 0x2F Request for Cue-List bytes
// 0x30 Cue-List bytes
// 0x31 Request for Take List bytes
// 0x32 Take List bytes
// 0x33 Request for Miscellaneous bytes
// 0x34 Miscellaneous bytes
// 0x35 Request Volume List item
// 0x36 Volume List item (only used in response to request)
// 0x37 Request Harddisk Directory entry
// 0x38 Harddisk Directory entry (only used in response to request)
enum Opcodes {
    // ID	Mnemonic	Direction	Description
    // 00h	RSTAT	<	request S1000 status
    RSTAT = 0x00,
    // 01h	STAT	>	S1000 status report
    STAT,
    // 02h	RPLIST	>	request list of resident program names
    RPLIST,
    // 03h	PLIST	>	list of resident program names
    PLIST,
    // 04h	RSLIST	<	request list of resident sample names
    RLIST,
    // 05h	SLIST	>	list of resident sample names
    SLIST,
    // 06h	RPDATA	<	request program common data
    RPDATA,
    // 07h	PDATA	<>	program common data
    PDATA,
    // 08h	RKDATA	<	request keygroup data
    RKDATA,
    // 09h	KDATA	<>	keygroup data
    KDATA,
    // 0Ah	RSDATA	<	request sample header data
    RSDATA,
    // 0Bh	SDATA	<>	sample header data
    SDATA,
    // 0Ch	RSPACK	<	request sample data packet(s)
    RSPACK,
    // 0Dh	ASPACK	<	accept sample data packet(s)
    ASPACK,
    // 0Eh	RDDATA	<	request drum settings
    OxRDDATA,
    // 0Fh	DDATA	<>	drum input settings
    DDATA,
    // 10h	RMDATA	<	request miscellaneous data
    RMDATA,
    // 11h	MDATA	<>	miscellaneous data
    MDATA,
    // 12h	DELP	<	delete program and its keygroup
    DELP,
    // 13h	DELK	<	delete keygroup
    DELK,
    // 14h	DELS	<	delete sample header and data
    DELS,
    // 15h	SETEX	<	set S1000 exclusive channel
    SETEX,
    // 16h	REPLY	>	S1000 command reply (error or ok)
    REPLY,
    // 1Dh	CASPACK	<	corrected ASPACK
    CASPACK = 0x1D
}


class s3000xl implements Device {
    private in: midi.Input;
    private out: midi.Output;

    constructor(input: midi.Input, output: midi.Output) {
        this.in = input
        this.out = output
    }

    getSampleNames(names: any[]) {

    }

    private send(opcode: number, data: number[]) {

    }
}
