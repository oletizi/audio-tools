import {Card, CardContent, CardHeader, Typography} from "@mui/material";
import React from "react";

export function AkaiDiskView() {
    return (
        <Card>
            <CardHeader title="Your Disk So Far" subtitle="There will be stuff here."/>
            <CardContent>
                <Typography>Put disk stuff in here.</Typography>
            </CardContent>
        </Card>
    )
}