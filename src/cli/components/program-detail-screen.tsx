import {Program} from "@/midi/devices/s3000xl.js";
import React from "react";
import {Box} from 'ink'
import {DataField} from "@/cli/components/data-field.js";
import {CliApp} from "@/cli/cli-s3000xl-ink.js";

export function ProgramDetailScreen({app, program}: { app: CliApp, program: Program }) {

    return (
        <Box justifyContent="flex-start" flexDirection="column" width={32}>
            <DataField app={app}
                       label="Program Name"
                       defaultValue={program.getProgramName()}
                       onChange={(v) => {
                           return new Promise((resolve, reject) => {
                               program.setProgramName(String(v))
                               app.save(program)
                               resolve(program.getProgramName())
                           })
                       }}/>
        </Box>)
}

