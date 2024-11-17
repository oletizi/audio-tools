import React, {useState} from 'react'
import {MutableNumber} from "@/lib/lib-core";
import {
    Alert,
    createListCollection, ListCollection,
    SelectContent, SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText
} from "@chakra-ui/react";

export interface Option {
    label: string
    value: string
    selected: boolean
}

export interface Selectable {
    onSelect: Function
    options: Option[]
}

export function LabeledRange({data, label}: { data: MutableNumber, label: string }) {
    const [value, setValue] = useState(data.value)
    return (
        <div className={'columns-2'}>
            {/*<SlRange label={label}*/}
            {/*         value={value}*/}
            {/*         min={data.min}*/}
            {/*         max={data.max}*/}
            {/*         step={data.step}*/}
            {/*         onSlChange={async (event) => {*/}
            {/*             let val = (event.target as any).value;*/}
            {/*             setValue(val)*/}
            {/*             await data.mutator(val)*/}
            {/*         }}/>*/}
            <div className={'p-2.5'}>{value}</div>
        </div>
    )
}

export function SimpleSelect({options, defaultValue, mutator, label}:
                                 { options: Option[], mutator: Function, label: string }) {
    const [selected, setSelected] = useState(defaultValue)
    const items: ListCollection<Option> = createListCollection({items: options})

    return (
        <SelectRoot collection={items} defaultValue={defaultValue}>
            <SelectLabel>{label}</SelectLabel>
            <SelectTrigger>
                <SelectValueText placeholder={'Select...'}/>
            </SelectTrigger>
            <SelectContent>
                {options.map((o) => (
                    <SelectItem item={o} key={o.value}>{o.label}</SelectItem>
                ))}
            </SelectContent>
        </SelectRoot>
    )
}


