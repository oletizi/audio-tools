import {Program} from "@/midi/devices/s3000xl.js";
import React from "react";
import {Box} from 'ink'
import {DataField} from "@/cli/components/data-field.js";
import {App} from "@/cli/cli-s3000xl-ink.js";

export function ProgramDetailScreen({app, program}: { app: App, program: Program }) {
    const out = app.out
    return (
        <Box justifyContent="flex-start" flexDirection="column" width={32}>
            <DataField field={{label: 'Program Name', value: program.getProgramName()}} onChange={(v) => {
                out.log(`Setting program name: ${v}...`)
                program.setProgramName(v)
                out.log(`Saving program...`)
                app.save(program)
            }}/>
        </Box>)
}

