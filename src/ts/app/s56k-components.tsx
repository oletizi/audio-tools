import React from "react";
import {Output} from "webmidi";

export interface MidiOutputSpec {
    output: Output
    isActive: boolean
    action: () => void
}

export function MidiOutputList(outs: MidiOutputSpec[]) {

    const items = outs.map((spec) => {
        const classes = ['list-group-item']
        classes.push(spec.isActive ? 'active' : 'list-group-item-active')


        return (<li className={classes.join(' ')}
                    key={spec.output.name}
                    onClick={spec.action}
                    data-bs-toggle="collapse"
                    data-bs-target="#midi-output-view">{spec.output.name}</li>)
    })
    return (<ul className={'list-group'}>{items}</ul>)
}

export function MidiOutputSelectButton(current: string) {
    return (<button className="btn btn-primary mt-4" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#midi-output-view"><span className={'fw-bold'}>MIDI Out: </span>{current}</button>)
}