import React, {useEffect, useState} from "react"
import {Box, Text, useFocus, useFocusManager, useInput} from "ink"
import fs from "fs/promises";
import path from "path";

function Item({children, id, onClick}: { id: string, onClick: (string) => void }) {
    const {isFocused} = useFocus({id})
    useInput((i, key) => {
        if (isFocused && key.return) {
            onClick(id)
        }
    })
    return (
        <Box justifyContent="space-between">
            <Box><Text inverse={isFocused}>{children}</Text></Box>
        </Box>)
}

export function FileChooser({defaultDirectory, onSubmit}: { defaultDirectory: string, onSubmit: (v: string) => void }) {
    const [dir, setDir] = useState<string>(defaultDirectory)
    const [files, setFiles] = useState<any>(null)
    const {focus, focusNext, focusPrevious} = useFocusManager()
    useEffect(() => {
        fs.readdir(dir).then(async list => {
            const f = [(<Item key="0" id="0" onClick={() => setDir(path.join(dir, '..'))}>../</Item>)]
            let id = 0
            for (const filename of list) {
                if (filename.startsWith('.DS_Store')) {
                    continue
                }
                id++
                const file = path.join(dir, filename)
                const s = await fs.stat(file)

                f.push(<Item key={id}
                             id={String(id)}
                             onClick={(id) => {
                                 console.log(`CLICKED: ${id}`)
                                 const selection = path.join(dir, filename);
                                 if (s.isDirectory()) {
                                     setDir(selection)
                                 } else {
                                     onSubmit(selection)
                                 }
                             }}>{filename}{s.isDirectory() ? '/' : ''}</Item>)
            }

            setFiles(f)
            focus("1")
        })
    }, [dir])

    useInput((i, key) => {
        if (key.downArrow || key.rightArrow) {
            focusNext()
        } else if (key.upArrow || key.leftArrow) {
            focusPrevious()
        }
    })


    return (
        <Box flexDirection="column" width="100%">
            <Text>{dir}:</Text>
            <Text> </Text>
            {files}
        </Box>
    )
}