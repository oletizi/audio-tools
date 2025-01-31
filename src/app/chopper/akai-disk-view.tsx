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
import {AudioFile, ExpandLess, ExpandMore} from "@mui/icons-material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import dayjs from "dayjs";

export function AkaiDiskView({data, update}: { data: AkaiDisk, update: () => AkaiDisk }) {
    const [disk, setDisk] = useState(data)
    let items = 0
    return (
        <Card>
            <CardHeader className="shadow-md" title="Your Disk So Far"/>
            <CardContent>
                {disk.partitions.map(partition => {
                    items++
                    return (
                        <List key={partition.name} sx={{width: '100%'}}>
                            <PartitionView data={partition} openDefault={items === 1}/>
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

function PartitionView({data, openDefault}: { data: AkaiPartition, openDefault: boolean }) {
    const [open, setOpen] = useState(openDefault)
    let items = 0
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><StorageIcon/></ListItemIcon>
                <ListItemText primary={`Partition ${data.name}`}/>
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open}>
                <List sx={{width: '100%'}} dense={true} disablePadding>
                    {data.volumes.map(volume => {
                        items++
                        return (<VolumeView key={volume.name}  openDefault={items === 1}  data={volume}/>)
                    })}
                </List>
            </Collapse>
        </>
    )
}

function VolumeView({data, openDefault}: { data: AkaiVolume, openDefault: boolean}) {
    const [open, setOpen] = useState(openDefault)
    let items = 0
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><SaveIcon/></ListItemIcon>
                <ListItemText primary={`Vol: ${path.parse(data.name).name}`}/>
                {open ? <ExpandLess /> : <ExpandMore />}
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
