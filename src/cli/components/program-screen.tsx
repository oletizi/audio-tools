import React from "react";
import {Box} from 'ink'
import {Select} from '@inkjs/ui'
import {ProgramDetailScreen} from "@/cli/components/program-detail-screen.js";
import {Device} from "@/midi/akai-s3000xl.js";
import {App} from "@/cli/cli-s3000xl-ink.js";

export function ProgramScreen({app, device, names, setScreen}: { app: App, device: Device, names: string[], setScreen: (any) => void }) {
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