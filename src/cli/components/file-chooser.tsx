import React, {useEffect, useState} from "react"
import {Box, Text, useFocus, useFocusManager} from "ink"
import fs from "fs/promises";
import path from "path";

function Item({children, id}: {id: string}) {
    const isFocused = useFocus(id)
    const inverse = isFocused ? ' (focused)' : ''
    return (
        <Box justifyContent="space-between">
            <Box><Text>{children}</Text></Box>
            <Box><Text>{inverse}</Text></Box>
        </Box>)
}

export function FileChooser({defaultDirectory, onSubmit}: { defaultDirectory: string, onSubmit: (v: string) => void }) {
    const [dir, setDir] = useState<string>(defaultDirectory)
    const [files, setFiles] = useState<any>(null)
    const {focus} = useFocusManager()
    useEffect(() => {
        fs.readdir(dir).then(async list => {
            const f = []
            let id = 0
            for (const filename of list) {
                console.log(filename)
                if (filename.startsWith('.DS_Store')) {
                    continue
                }
                id++
                const file = path.join(dir, filename)
                const s = await fs.stat(file)

                f.push(<Item key={id} id={String(id)}>{id}: {s.isDirectory() ? 'D' : 'F'}: {filename}</Item>)
            }
            setFiles(f)
            // if (f.length > 0) {
            //     focus("0")
            // }
        })
    }, [dir])
    return (
        <Box flexDirection="column" width="50%">
            <Text>{dir}</Text>
            {files}
        </Box>
    )
}