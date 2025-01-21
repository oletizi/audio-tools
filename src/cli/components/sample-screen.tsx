import {CliApp} from "@/cli/cli-s3000xl-ink.js";
import React from "react";
import {Box} from "ink"
import {Select} from "@inkjs/ui"

export function SampleScreen({app, names}: { app: CliApp, names: string[] }) {
    const options = names.map((sampleName) => {
        return {label: sampleName, value: sampleName}
    })
    return (
        <Box>
            <Select options={options} onChange={v => app.doSampleDetail(v)}/>
        </Box>
    )
}