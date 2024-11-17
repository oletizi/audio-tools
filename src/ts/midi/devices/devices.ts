// GENERATED: 11/17/2024, 3:11:57 PM
// DO NOT EDIT. YOUR CHANGES WILL BE OVERWRITTEN.

import {MutableNumber, MutableString, Result, NumberResult, StringResult} from "@/lib/lib-core"
import {Sysex} from "@/midi/sysex"
import {newDeviceObject} from "@/midi/device"
import {ProcessOutput} from "@/process-output"
import {programOutputSpec} from "@/midi/devices/specs"

export interface ProgramOutputInfo {
  loudness: MutableNumber
  velocitySensitivity: MutableNumber
  ampMod1Source: MutableNumber
  ampMod2Source: MutableNumber
  ampMod1Value: MutableNumber
  ampMod2Value: MutableNumber
  panMod1Source: MutableNumber
  panMod2Source: MutableNumber
  panMod3source: MutableNumber
  panMod1Value: MutableNumber
  panMod2Value: MutableNumber
  panMod3Value: MutableNumber
}

export interface ProgramOutputInfoResult extends Result {
  data: ProgramOutputInfo
}


export interface ProgramOutput {
  getLoudness(): NumberResult
  getVelocitySensitivity(): NumberResult
  getAmpMod1Source(): NumberResult
  getAmpMod2Source(): NumberResult
  getAmpMod1Value(): NumberResult
  getAmpMod2Value(): NumberResult
  getPanMod1Source(): NumberResult
  getPanMod2Source(): NumberResult
  getPanMod3source(): NumberResult
  getPanMod1Value(): NumberResult
  getPanMod2Value(): NumberResult
  getPanMod3Value(): NumberResult
  getInfo(): ProgramOutputInfo
}


export function newProgramOutput(sysex: Sysex, out: ProcessOutput) {
  return newDeviceObject(programOutputSpec, sysex, out) as ProgramOutput}

