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

        return (<li>
            <a className={classes.join(' ')}
               href={'#'}
               key={spec.output.name}
               onClick={spec.action}
               data-bs-toggle="dropdown"
               data-bs-target="#midi-output-view">{spec.output.name}</a></li>)
    })
    return (<div>
        <button className="btn btn-primary dropdown-toggle" type="button"
                data-bs-toggle="dropdown"
                data-bs-target="#midi-output-view"><span className={'fw-bold'}>MIDI Out: </span>{current}</button>
        <ul className={'dropdown-menu'}>{items}</ul>
    </div>)
}

export function MidiOutputSelectButton(current: string) {
    return (<button className="btn btn-primary dropdown-toggle" type="button"
                    data-bs-toggle="dropdown"
                    data-bs-target="#midi-output-view"><span className={'fw-bold'}>MIDI Out: </span>{current}</button>)
}

