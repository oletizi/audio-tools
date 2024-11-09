import React from "react";
import {Output} from "webmidi";

export interface MidiOutputSpec {
    output: Output
    isActive: boolean
    action: () => void
}

export function MidiOutputSelect(outs: MidiOutputSpec[]) {
    let current = ''
    const items = outs.map((spec) => {
        const classes = ['dropdown-item']
        if (spec.isActive) {
            classes.push('active')
            current = spec.output.name
        }

        return (<li key={spec.output.name}>
            <a className={'dropdown-item'}
               href={'#'}
               onClick={spec.action}
               data-bs-toggle="dropdown"
               data-bs-target="#midi-output-view">{spec.output.name}</a></li>)
    })
    return (<div>
        <button className="btn btn-primary dropdown-toggle" type="button"
                data-bs-toggle="dropdown"
                data-bs-target="#midi-output-view"><span className={'fw-bold'}>MIDI Out: </span>{current}</button>
        <ul id="midi-output-view" className={'dropdown-menu'}>{items}</ul>
    </div>)
}
