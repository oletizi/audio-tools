import React from "react";
import {Box} from 'ink'
import {Select} from '@inkjs/ui'
import {ProgramDetailScreen} from "@/cli/components/program-detail-screen.js";
import {Device} from "@/midi/akai-s3000xl.js";

export function ProgramScreen({device, names, setScreen}: { device: Device, names: string[], setScreen: (any) => void }) {
    const options = names.map((programName) => {
        return {label: programName, value: programName}
    })
    return (
        <Box>
            <Select options={options} onChange={(v) => {
                device.getProgram(v).then(program => {
                    setScreen(<ProgramDetailScreen program={program}/>)
                })
            }}/>
        </Box>
    )
}