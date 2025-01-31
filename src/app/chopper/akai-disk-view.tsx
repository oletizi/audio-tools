import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    List,
    ListItem,
    ListItemButton, ListItemIcon,
    ListItemText,
    ListSubheader
} from "@mui/material";
import React, {useState} from "react";
import {AkaiDisk, AkaiPartition, AkaiRecord, AkaiRecordType, AkaiVolume} from "@/model/akai";
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage';
import SaveIcon from '@mui/icons-material/Save';
import path from "path";
import {AudioFile} from "@mui/icons-material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import dayjs from "dayjs";

export function AkaiDiskView({data, update}: { data: AkaiDisk, update: () => AkaiDisk }) {
    const [disk, setDisk] = useState(data)
    const [open, setOpen] = useState(true)
    const dateFormat = dayjs(new Date(disk.timestamp)).format()
    return (
        <Card>
            <CardHeader title="Your Disk So Far"/>
            <CardContent>
                {disk.partitions.map(partition => {
                    return (
                        <List key={partition.name} sx={{width: '100%'}}>
                            <PartitionView data={partition}/>
                        </List>)
                })}
            </CardContent>
            <CardActions>
                <Button onClick={() => {
                    setDisk(update())
                }}><RefreshIcon/></Button>
            </CardActions>
        </Card>
    )
}

function PartitionView({data}: { data: AkaiPartition }) {
    const [open, setOpen] = useState(true)
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><StorageIcon/></ListItemIcon>
                <ListItemText primary={`Partition ${data.name}`}/>
            </ListItemButton>
            <Collapse in={open}>
                <List sx={{width: '100%'}} dense={true} disablePadding>
                    {data.volumes.map(volume => {
                        return (<VolumeView key={volume.name} data={volume}/>)
                    })}
                </List>
            </Collapse>
        </>
    )
}

function VolumeView({data}: { data: AkaiVolume }) {
    const [open, setOpen] = useState(true)
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><SaveIcon/></ListItemIcon>
                <ListItemText primary={`Vol: ${path.parse(data.name).name}`}/>
            </ListItemButton>
            <Collapse in={open}>
                <List sx={{width: '100%'}} dense={true} disablePadding>
                    {data.records.map(record => {
                        return (
                            <ListItem sx={{pl: 4}} key={record.name} disableGutters><RecordsView
                                data={data.records}/></ListItem>)
                    })}
                </List>
            </Collapse>
        </>
    )
}

function RecordsView({data}: { data: AkaiRecord[] }) {
    return (
        <List sx={{width: '100%'}} dense={false} disablePadding>
            {data.map(record => {
                return (
                    <ListItem key={record.name} disableGutters>
                        <ListItemIcon>{record.type === AkaiRecordType.SAMPLE ? <AudioFile/> :
                            <LibraryBooksIcon/>}</ListItemIcon>
                        <ListItemText primary={path.parse(record.name).name}/>
                    </ListItem>)
            })}
        </List>
    )
}
