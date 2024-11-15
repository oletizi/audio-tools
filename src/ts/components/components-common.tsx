import React from 'react'
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
export interface Option {
    name: string
    value: string
    active: boolean
}

export interface Selectable {
    value: string
    onSelect: Function
    options: Option[]
}

export function Status({msg, variant}) {
    return (
        <SlAlert variant={variant} open closable>{msg}</SlAlert>
    )
}


