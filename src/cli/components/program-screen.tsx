import React from "react";
import {Box} from 'ink'
import {Select} from '@inkjs/ui'
import {CliApp} from "@/cli/cli-s3000xl-ink.js";

export function ProgramScreen({app, names}: { app: CliApp, names: string[] }) {
    const options = names.map((programName) => {
        return {label: programName, value: programName}
    })
    return (
        <Box>
            <Select options={options} onChange={(v) => {
                app.doProgramDetail(v)
            }}/>
        </Box>
    )
}

