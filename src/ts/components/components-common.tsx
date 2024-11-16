import React, {useState} from 'react'
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js";
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js";
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js";
import SlRange from "@shoelace-style/shoelace/dist/react/range/index.js";
import {MutableNumber} from "../lib/lib-core";
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

export function LabeledRange({data, label}: { data: MutableNumber, label: string }) {
    const [value, setValue] = useState(data.value)
    return (
        <div className={'columns-2'}>
            <SlRange label={label}
                     value={value}
                     min={data.min}
                     max={data.max}
                     step={data.step}
                     onSlChange={async (event) => {
                         let val = (event.target as any).value;
                         setValue(val)
                         await data.mutator(val)
                     }}/>
            <div className={'p-2.5'}>{value}</div>
        </div>
    )
}

export function LabeledDropdown({items, defaultValue, mutator, label}) {
    const [selected, setSelected] = useState(defaultValue)
    return (
        <div className={'columns-2'}>
            <SlDropdown className={'w-full'}>
                <SlButton className={'w-full'} slot={'trigger'} value={defaultValue.toString()} caret>{label}</SlButton>
                <SlMenu onSlSelect={async (event) => {
                    const val = event.detail.item.value
                    setSelected(val)
                    await mutator(Number.parseInt(val))
                }}>
                    {Object.getOwnPropertyNames(items)
                        .map(val => <SlMenuItem
                            key={label + val}
                            name={items[val]}
                            value={val}>{items[val]}</SlMenuItem>)}
                </SlMenu>
            </SlDropdown>
            <div className={'p-2.5'}>{items[selected]}</div>
        </div>)
}

export function Status({msg, variant}) {
    return (
        <SlAlert variant={variant} open closable>{msg}</SlAlert>
    )
}


