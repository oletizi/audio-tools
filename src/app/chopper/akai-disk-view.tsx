import {
    Button,
    Card, CardActions,
    CardContent,
    CardHeader, Collapse,
    List,
    ListItem,
    ListItemButton, ListSubheader
} from "@mui/material";
import React, {useState} from "react";
import {AkaiDisk, AkaiPartition, AkaiRecord, AkaiVolume} from "@/akaitools/akaitools";
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage';
import SaveIcon from '@mui/icons-material/Save';
import path from "path";

export function AkaiDiskView({data, update}: { data: AkaiDisk, update: () => AkaiDisk }) {
    const [disk, setDisk] = useState(data)
    return (
        <Card>
            <CardHeader title="Your Disk So Far" subheader={new Date(disk.timestamp).toString()}/>
            <CardContent>
                <List className="grow">
                    {disk.partitions.map(partition => {
                        return (<ListItem key={partition.name}><PartitionView data={partition}/></ListItem>)
                    })}
                </List>
            </CardContent>
            <CardActions>
                <Button onClick={() => {setDisk(update())}}><RefreshIcon/></Button>
            </CardActions>
        </Card>
    )
}

function PartitionView({data}: { data: AkaiPartition }) {
    const [open, setOpen] = useState(true)
    return (<List subheader={
            <ListItemButton>
                <ListSubheader onClick={() => setOpen(!open)}>
                    <SaveIcon/> {data.name}
                </ListSubheader>
            </ListItemButton>
        }>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {data.volumes.map(volume => {
                    return (<ListItem key={volume.name}><VolumeView data={volume}/></ListItem>)
                })}
            </Collapse>
        </List>
    )
}

function VolumeView({data}: { data: AkaiVolume }) {
    const [open, setOpen] = useState(true)
    return (
        <List subheader={
            <ListItemButton onClick={() => {
                setOpen(!open)
            }}><ListSubheader component="div" id="nested-list-subheader">
                <StorageIcon/> {path.parse(data.name).name}
            </ListSubheader></ListItemButton>
        }>
            <Collapse in={open} timeout="auto" unmountOnExit>
                {data.records.map(record => {
                    return (<ListItem key={record.name}><RecordsView data={data.records}/></ListItem>)
                })}
            </Collapse>
        </List>
    )
}

function RecordsView({data}: { data: AkaiRecord[] }) {
    return (
        <List>
            {data.map(record => {
                return (<ListItem key={record.name}>{path.parse(record.name).name}</ListItem>)
            })}
        </List>
    )
}