import React from "react";
import {Input, Output} from "webmidi";

let sequence = 0

export interface MidiDeviceSpec {
    name: string
    isActive: boolean
    action: () => void
}

function uid() {
    return sequence++ + '-' + Math.random().toString(16).slice(2)
}

export function MidiDeviceSelect(specs: MidiDeviceSpec[], label: string = "Midi Output: ") {
    let current = ''
    const target = `midi-device-view-${uid()}`
    const items = specs.map((spec) => {
        const classes = ['dropdown-item']
        if (spec.isActive) {
            classes.push('active')
            current = spec.name
        }

        return (<li key={spec.name}>
            <a className={classes.join(' ')}
               href={'#'}
               onClick={spec.action}
               data-bs-toggle="dropdown"
               data-bs-target={target}>{spec.name}</a></li>)
    })
    return (<div>
        <button className="btn btn-primary dropdown-toggle" type="button"
                data-bs-toggle="dropdown"
                data-bs-target={'#' + target}><span className={'fw-bold'}>{label}</span>{current}</button>
        <ul id={target} className={'dropdown-menu'}>{items}</ul>
    </div>)
}
