import React, {useState} from 'react'
import {MutableNumber} from "@/lib/lib-core";
import {
    Card,
    createListCollection, ListCollection,
    SelectContent, SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText, Separator, Slider
} from "@chakra-ui/react";
import {Slider} from '@/components/chakra/slider'

export interface Option {
    label: string
    value: string
    selected: boolean
}

export interface Selectable {
    onSelect: Function
    options: Option[]
}

export function MutableSlider({data, label}: { data: MutableNumber, label: string }) {
    const [value, setValue] = useState([data.value])
    return (
        <Slider
            onValueChange={(event) => setValue(event.value)}
            onValueChangeEnd={async (event) => {
                const val = event.value
                console.log(`New Value: ${val[0]}`)
                setValue(val)
                await data.mutator(val[0])
            }}
            label={`${label} (${value[0]})`}
            // XXX: TODO: Chakra sliders don't like negative values. Need to scale the range to positive, then convert back to neg/pos.
            min={0}
            max={data.max}
            value={value}
        />
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

export function ControlPanel({children, title}) {
    return (
        <Card.Root flexGrow={1}>
            <Card.Body gap={4}>
                <Card.Title>{title}</Card.Title>
                {children}
            </Card.Body>
        </Card.Root>
    )
}
