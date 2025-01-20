import React, {useState} from "react";
import {Box, Text, useFocus, useFocusManager, useInput} from 'ink'
import {TextInput} from '@inkjs/ui'
import {CliApp} from "@/cli/cli-s3000xl-ink.js";
import {Button} from "@/cli/components/button.js";

export function DataField({defaultValue, label, onChange, app}: {
    defaultValue?: string | number
    label: string
    onChange: (v: string | number) => string | number
    app?: CliApp
}) {
    const [value, setValue] = useState<string | number>(defaultValue)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const {focusNext} = useFocusManager()
    const {isFocused} = useFocus()

    function toggleEditing(b = !isEditing) {
        app.setIsEditing(b)
        setIsEditing(b)
    }

    useInput((value, key) => {
        if (key.escape) {
            toggleEditing(false)
        }
    })

    return (
        <Box justifyContent="space-between">
            <Text>{label}</Text>
            {isEditing ?
                <TextInput isDisabled={!isFocused}
                           defaultValue={value}
                           onBlur={() => toggleEditing()}
                           onSubmit={(v) => {
                               toggleEditing()
                               const newValue = onChange(v)
                               setValue(newValue)
                           }}/>
                : <Button variant="plain"
                          onClick={() => {
                              toggleEditing()
                              focusNext()
                          }
                          }>{value}</Button>}
        </Box>)
}
