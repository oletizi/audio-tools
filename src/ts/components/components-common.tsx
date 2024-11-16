import React, {useState} from 'react'
import SlAlert from "@shoelace-style/shoelace/dist/react/alert/index.js";
import SlDropdown from "@shoelace-style/shoelace/dist/react/dropdown/index.js";
import SlButton from "@shoelace-style/shoelace/dist/react/button/index.js";
import SlMenu from "@shoelace-style/shoelace/dist/react/menu/index.js";
import SlMenuItem from "@shoelace-style/shoelace/dist/react/menu-item/index.js";
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

export function LabeledDropdown({items, defaultValue, mutator, label}) {
    const [selected, setSelected] = useState(defaultValue)
    return (
        <div className={'columns-2'}>
            <SlDropdown className={'w-full'}>
                <SlButton className={'w-full'} slot={'trigger'} value={defaultValue.toString()} caret>{label}</SlButton>
                <SlMenu onSlSelect={async (event) => {
                    const val = event.detail.item.value
                    setSelected(val)
                    // XXX: TODO: Handle errors here
                    const result = await mutator(Number.parseInt(val))
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


