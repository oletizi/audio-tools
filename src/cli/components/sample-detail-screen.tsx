import {CliApp} from "@/cli/cli-s3000xl-ink.js";
import {Sample} from "@/midi/devices/s3000xl.js";
import React from "react";
import {Box, Text} from 'ink'

export function SampleDetailScreen({app, sample}: { app: CliApp, sample: Sample }) {
    return (
        <Box>
            <Text>Sample detail for: {sample.getSampleName()}</Text>
        </Box>)
}

