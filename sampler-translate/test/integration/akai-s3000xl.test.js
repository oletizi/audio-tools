"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var midi_1 = require("midi");
var chai_1 = require("chai");
var akai_s3000xl_1 = require("@/midi/akai-s3000xl");
var s3000xl_1 = require("@/midi/devices/s3000xl");
function listenForMessage(input) {
    return new Promise(function (resolve, reject) {
        input.on('message', function (deltaTime, message) {
            resolve(message);
        });
        setTimeout(function () { return reject(); }, 2 * 1000);
    });
}
function init(io) {
    for (var i = 0; i < io.getPortCount(); i++) {
        if (io.getPortName(i).startsWith('IAC')) {
            continue;
        }
        console.log("Opening port ".concat(io.getPortName(i)));
        io.openPort(i);
        break;
    }
    return io;
}
var input, output;
function midiSetup() {
    output = init(new midi_1.default.Output());
    input = init(new midi_1.default.Input());
    input.ignoreTypes(false, false, false);
}
function midiTeardown() {
    input === null || input === void 0 ? void 0 : input.closePort();
    output === null || output === void 0 ? void 0 : output.closePort();
}
describe('akai-s3000xl tests', function () {
    before(midiSetup);
    after(midiTeardown);
    it('Reads and writes akai-formatted strings', function () {
        var v = 'a nice strin'; // max 12 chars
        var data = (0, akai_s3000xl_1.string2AkaiBytes)(v);
        var vv = (0, akai_s3000xl_1.akaiByte2String)(data);
        (0, chai_1.expect)(vv).eq(v.toUpperCase());
        v = 'shorty';
        data = (0, akai_s3000xl_1.string2AkaiBytes)(v);
        vv = (0, akai_s3000xl_1.akaiByte2String)(data);
        console.log("vv: <".concat(vv, ">"));
        (0, chai_1.expect)(vv).eq(v.toUpperCase() + '      ');
    });
    it('fetches resident sample names', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    names = [];
                    return [4 /*yield*/, device.fetchSampleNames(names)];
                case 1:
                    _a.sent();
                    (0, chai_1.expect)(names).not.empty;
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetches sample header', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, header, sampleNumber;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    header = {};
                    sampleNumber = 8;
                    return [4 /*yield*/, device.fetchSampleHeader(sampleNumber, header)];
                case 1:
                    _a.sent();
                    console.log(header);
                    (0, chai_1.expect)(header['SNUMBER']).eq(sampleNumber);
                    (0, chai_1.expect)(header.SHIDENT).eq(3); // Akai magic value
                    (0, chai_1.expect)(header.SSRVLD).eq(0x80); // Akai magic value
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetches resident program names', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, names;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    names = [];
                    return [4 /*yield*/, device.fetchProgramNames(names)];
                case 1:
                    _a.sent();
                    console.log("Sample names:");
                    console.log(names);
                    (0, chai_1.expect)(names).not.empty;
                    (0, chai_1.expect)(names).deep.eq(device.getProgramNames([]));
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetches program header', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    console.log(header);
                    return [2 /*return*/];
            }
        });
    }); });
    it('writes program header', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header, program;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    program = new s3000xl_1.Program(device, header);
                    console.log(header);
                    // await device.writeProgram(header)
                    return [4 /*yield*/, program.save()];
                case 2:
                    // await device.writeProgram(header)
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("writes program name", function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, device.writeProgramName(header, 'new name')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("writes program name via generated class", function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header, program, newName, h2, p2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    program = new s3000xl_1.Program(device, header);
                    program.setProgramName('test program');
                    // await device.writeProgram(header)
                    return [4 /*yield*/, program.save()];
                case 2:
                    // await device.writeProgram(header)
                    _a.sent();
                    newName = 'a new name';
                    (0, chai_1.expect)(program.getProgramName().trim()).not.eq(newName.toUpperCase());
                    program.setProgramName('a new name');
                    (0, chai_1.expect)(program.getProgramName().trim()).eq(newName.toUpperCase());
                    // await device.writeProgram(header)
                    return [4 /*yield*/, program.save()];
                case 3:
                    // await device.writeProgram(header)
                    _a.sent();
                    h2 = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, h2)];
                case 4:
                    _a.sent();
                    p2 = new s3000xl_1.Program(device, h2);
                    (0, chai_1.expect)(p2.getProgramName()).eq(program.getProgramName());
                    return [2 /*return*/];
            }
        });
    }); });
    it("writes program level via generated class", function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header, program, level, h2, p2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    program = new s3000xl_1.Program(device, header);
                    level = program.getProgramLevel();
                    program.setProgramLevel(level - 1);
                    (0, chai_1.expect)(program.getProgramLevel()).eq(level - 1);
                    return [4 /*yield*/, program.save()];
                case 2:
                    _a.sent();
                    h2 = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, h2)];
                case 3:
                    _a.sent();
                    p2 = new s3000xl_1.Program(device, h2);
                    (0, chai_1.expect)(p2.getProgramLevel()).eq(program.getProgramLevel());
                    return [2 /*return*/];
            }
        });
    }); });
    it("writes program polyphony", function () { return __awaiter(void 0, void 0, void 0, function () {
        var polyphony, device, programNumber, header, h2, _i, _a, field;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    polyphony = 2;
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _b.sent();
                    (0, chai_1.expect)(header.POLYPH).not.eq(polyphony);
                    return [4 /*yield*/, device.writeProgramPolyphony(header, polyphony)];
                case 2:
                    _b.sent();
                    h2 = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, h2)];
                case 3:
                    _b.sent();
                    for (_i = 0, _a = Object.getOwnPropertyNames(header); _i < _a.length; _i++) {
                        field = _a[_i];
                        if (!field.endsWith('Label')) {
                            console.log("".concat(field, ":"));
                            console.log("  old: ".concat(header[field]));
                            console.log("  new: ".concat(h2[field]));
                            if (header[field] !== h2[field]) {
                                console.log("  DIFFERENT!!!!");
                            }
                        }
                    }
                    (0, chai_1.expect)(h2.POLYPH).eq(polyphony);
                    return [2 /*return*/];
            }
        });
    }); });
    it("writes low note", function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, header, lowNote, program, h2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 0;
                    header = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, header)];
                case 1:
                    _a.sent();
                    lowNote = header.PLAYLO + 1;
                    (0, s3000xl_1.ProgramHeader_writePLAYLO)(header, lowNote);
                    program = new s3000xl_1.Program(device, header);
                    return [4 /*yield*/, program.save()];
                case 2:
                    _a.sent();
                    h2 = {};
                    return [4 /*yield*/, device.fetchProgramHeader(programNumber, h2)];
                case 3:
                    _a.sent();
                    (0, chai_1.expect)(h2.PLAYLO).eq(lowNote);
                    return [2 /*return*/];
            }
        });
    }); });
    it('fetches keygroup header', function () { return __awaiter(void 0, void 0, void 0, function () {
        var device, programNumber, keygroupNumber, header;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    device = (0, akai_s3000xl_1.newDevice)(input, output);
                    programNumber = 3;
                    keygroupNumber = 1;
                    header = {};
                    return [4 /*yield*/, device.fetchKeygroupHeader(programNumber, keygroupNumber, header)];
                case 1:
                    _a.sent();
                    (0, chai_1.expect)(header['PNUMBER']).equal(programNumber);
                    (0, chai_1.expect)(header['KNUMBER']).equal(keygroupNumber);
                    (0, chai_1.expect)(header.KGIDENT).equal(2); // magic Akai number
                    console.log(header);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('basic sysex tests', function () {
    before(midiSetup);
    after(midiTeardown);
    it('Initializes midi', function () {
        (0, chai_1.expect)(output).to.exist;
        (0, chai_1.expect)(input).to.exist;
    });
    it("Sends sysex", function () { return __awaiter(void 0, void 0, void 0, function () {
        var data, listener, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    listener = listenForMessage(input);
                    data = [0xF0, 0x47, 0x00, 0x04, 0x48, 0xF7];
                    console.log("Requesting names of resident samples...");
                    output.sendMessage(data);
                    return [4 /*yield*/, listener];
                case 1:
                    message = _a.sent();
                    console.log("Received message.");
                    console.log(message);
                    // request header for sample 0x09
                    listener = listenForMessage(input);
                    data = [0xF0, 0x47, 0x00, 0x0a, 0x48, 0x09, 0x00, 0xf7];
                    console.log("Requesting header for sample 0x09...");
                    output.sendMessage(data);
                    return [4 /*yield*/, listener];
                case 2:
                    message = _a.sent();
                    console.log("Received message:");
                    console.log(message);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('basic node midi tests', function () {
    it('gets a midi input', function () {
        var input = new midi_1.default.Input();
        (0, chai_1.expect)(input).to.exist;
        (0, chai_1.expect)(input.getPortCount()).gte(1);
        for (var i = 0; i < input.getPortCount(); i++) {
            console.log("Input [".concat(i, "]: ").concat(input.getPortName(i)));
        }
    });
    it('gets a midi output', function () {
        var output = new midi_1.default.Output();
        (0, chai_1.expect)(output).to.exist;
        (0, chai_1.expect)(output.getPortCount()).gte(1);
        for (var i = 0; i < output.getPortCount(); i++) {
            console.log("Output [".concat(i, "]: ").concat(output.getPortName(i)));
        }
    });
    it('sends and receives messages...', function () { return __awaiter(void 0, void 0, void 0, function () {
        var input, output, received, data, m, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    input = new midi_1.default.Input();
                    output = new midi_1.default.Output();
                    input.ignoreTypes(false, false, false);
                    received = new Promise(function (resolve) {
                        input.on('message', function (deltaTime, message) {
                            input.closePort();
                            output.closePort();
                            resolve(message);
                        });
                    });
                    // on MacOS, this will be the IAC bus; other platforms, YMMMV
                    input.openPort(0);
                    output.openPort(0);
                    data = [176, 22, 1];
                    output.sendMessage(data);
                    return [4 /*yield*/, received];
                case 1:
                    m = _a.sent();
                    for (i = 0; i < data.length; i++) {
                        (0, chai_1.expect)(m[i]).eq(data[i]);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
