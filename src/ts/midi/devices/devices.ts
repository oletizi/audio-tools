// DO NOT EDIT. THIS IS AUTO-GENERATED.

import {MutableNumber, MutableString, Result} from "@/lib/lib-core"
import {NumberResult, StringResult} from "@/lib/lib-core"

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

