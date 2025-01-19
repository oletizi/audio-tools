import {Program} from "@/midi/devices/s3000xl.js";
import React from "react";
import {Box, Text} from 'ink'

export function ProgramDetailScreen({program}: { program: Program }) {

    return (
        <Box justifyContent="flex-start" flexDirection="column" width={32}>
            <Box justifyContent="space-between"><Text>Program name:</Text><Text>{program.getProgramName()}</Text></Box>
        </Box>)
}

