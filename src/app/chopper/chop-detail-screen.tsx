import React, {useEffect, useState} from "react";
import {SampleMetadata} from "@/model/sample";
import {getMeta} from "@/lib/client-translator";
import {
    Alert,
    Button,
    Card, CardActions,
    CardContent,
    CardHeader,
    Paper,
    Slider, Snackbar,
    Table, TableBody,
    TableCell,
    TableRow,
    TextField
} from "@mui/material";
import {ChopApp} from "@/app/chopper/chop-app";
import {AkaiDisk} from "@/model/akai";

export function ChopDetailScreen(
    {
        app,
        file,
        onErrors = (e) => console.error(e)
    }: {
        app: ChopApp,
        file: string | null,
        onErrors: (e: Error | Error[]) => void,
    }) {
    const [meta, setMeta] = useState<SampleMetadata | null>(null)
    const [bpm, setBpm] = useState<number>(120)
    const [beatsPerChop, setBeatsPerChop] = useState<number>(4)
    const [prefix, setPrefix] = useState<string>('chop.01')
    const [disk, setDisk] = useState<AkaiDisk>({name: "", partitions: [], timestamp: 0})
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
    const [snackbarMessage, setSnackbarMessage] = useState<string>("Hi. I'm a snackbar!")
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "info" | "warning" | "error">("warning")
    app.addDiskListener((d: AkaiDisk) => {
        setDisk(d)
    })
    useEffect(() => {
        app.fetchDisk()
    }, [])
    useEffect(() => {
        if (file) {
            getMeta(file).then(r => {
                if (r.errors.length) {
                    onErrors(r.errors)
                } else {
                    setMeta(r.data)
                }
            })
        }
    }, [file])

    function validateChop(file: string, partition: number, prefix: string) {
        let rv = partition > 0 && partition <= disk.partitions.length
        if (rv) {
            for (const v of disk.partitions[partition - 1].volumes) {
                const volumeName = v.name.split('/').pop()?.trim()
                if (volumeName === prefix.trim()) {
                    setSnackbarMessage(`${prefix} already exists. Choose a different program name.`)
                    setSnackbarSeverity("warning")
                    setSnackbarOpen(true)
                    return false
                }
            }
        } else {
            setSnackbarMessage(`Invalid disk partition: ${partition}`)
            setSnackbarSeverity("warning")
            setSnackbarOpen(true)
        }
        return rv
    }

    function getSamplesPerBeat() {
        return Math.round(meta?.sampleRate / (bpm / 60))
    }

    function getTotalChops() {
        return Math.round(meta?.sampleLength / (getSamplesPerBeat() * beatsPerChop))
    }

    function getTotalBeats() {
        return Math.round(meta?.sampleLength / getSamplesPerBeat())
    }

    return (
        <Card className="grow" elevation="3">
            <CardHeader className="shadow-md" title={`Chop it!`}
                        subheader={`${file ? file : '(Choose a file)'}`}/>
            <CardContent>

                <div className="flex flex-col gap-4">
                    {meta ? (
                            <>
                                <Paper variant="outlined"><Metadata meta={meta}/></Paper>
                                <Paper variant="outlined" className="flex gap-5">
                                    <Table><TableBody>
                                        <TableRow><TableCell>Total Beats</TableCell>
                                            <TableCell>{getTotalBeats()}</TableCell></TableRow>
                                    </TableBody></Table>
                                    <Table><TableBody>
                                        <TableRow><TableCell>Total Chops</TableCell><TableCell>{getTotalChops()}</TableCell></TableRow>
                                    </TableBody> </Table>
                                </Paper>
                                <Paper variant="outlined" className="flex gap-5">
                                    <Table><TableBody>
                                        <TableRow>
                                            <TableCell>BPM ({bpm}) <Slider value={bpm} min={60}
                                                                           max={200}
                                                                           step={1}
                                                                           shiftStep={5}
                                                                           onChange={e => setBpm(e.target.value)}/></TableCell>
                                        </TableRow>
                                    </TableBody>
                                    </Table>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Beats per Chop ({beatsPerChop})
                                                    <Slider value={beatsPerChop} min={1} max={32} marks
                                                            step={1}
                                                            shiftStep={4}
                                                            onChange={e => setBeatsPerChop(e.target.value)}/></TableCell>
                                            </TableRow>
                                        </TableBody></Table>
                                </Paper>
                                <TextField label="Prog. Name" value={prefix} onChange={e => setPrefix(e.target.value)}/>

                                <CardActions>
                                    <Button variant="contained"
                                            onClick={() => {
                                                if (file) {
                                                    const partition = 1
                                                    if (validateChop(file, partition, prefix)) {
                                                        app.chop(file, partition, prefix, getSamplesPerBeat(), beatsPerChop).then(r => {
                                                            if (r.errors?.length > 0) {
                                                                setSnackbarSeverity("warning")
                                                                setSnackbarMessage(r.errors[0].message)
                                                                setSnackbarOpen(true)
                                                            } else {
                                                                setSnackbarSeverity("success")
                                                                setSnackbarMessage(`Chop ${prefix} created.`)
                                                                setSnackbarOpen(true)
                                                                app.fetchDisk()
                                                            }
                                                        })
                                                    }
                                                }
                                            }}>Do It!</Button>
                                    <Snackbar
                                        open={snackbarOpen}
                                        autoHideDuration={6000}
                                        onClose={() => setSnackbarOpen(false)}>
                                        <Alert
                                            onClose={() => setSnackbarOpen(false)}
                                            severity={snackbarSeverity}
                                            variant="filled"
                                            sx={{width: '100%'}}>
                                            {snackbarMessage}
                                        </Alert>
                                    </Snackbar>
                                </CardActions>
                            </>) :
                        (<></>)
                    }
                </div>
            </CardContent>
        </Card>
    )
}

function Metadata({meta}: { meta: SampleMetadata | null }) {
    if (!meta) {
        return (<></>)
    }
    return (
        <div className="flex gap-5">
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="">Sample Rate</TableCell><TableCell>{meta.sampleRate}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Channel Count</TableCell><TableCell>{meta.channelCount}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>Bit Depth</TableCell><TableCell>{meta.bitDepth}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Sample Length</TableCell><TableCell>{meta.sampleLength}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
    // return (
    //     <div className="flex flex-col gap-4">
    //         <FieldDisplay label="Sample Rate" value={meta.sampleRate}/>
    //         <FieldDisplay label="Bit Depth" value={meta.bitDepth}/>
    //         <FieldDisplay label="Channel Count" value={meta.channelCount}/>
    //         <FieldDisplay label="Sample Length" value={meta.sampleLength}/>
    //     </div>)
}