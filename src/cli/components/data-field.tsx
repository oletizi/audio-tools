import React, {useState} from "react";
import {Box, Text} from 'ink'
import {TextInput} from '@inkjs/ui'
import {Button} from "@/cli/components/button.js";

export function DataField({field, onChange}: { field: { label: string, value: string | number }, onChange: Function }) {
    const [display, setDisplay] = useState(<Text>{field.value}</Text>)
    return (<Box justifyContent="space-between"><Button variant="plain" onClick={() => {
        setDisplay(<TextInput defaultValue={field.value} onSubmit={(v) => {
            onChange(v)
        }}/>)
    }}>{field.label}</Button>{display}</Box>)
}