import {
    Alert,
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
    Skeleton
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {AkaiDisk, AkaiPartition, AkaiRecord, AkaiRecordType, AkaiVolume} from "@/model/akai";
import RefreshIcon from '@mui/icons-material/Refresh'
import StorageIcon from '@mui/icons-material/Storage';
import SaveIcon from '@mui/icons-material/Save';
import path from "path";
import {AudioFile, ExpandLess, ExpandMore} from "@mui/icons-material";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import {getAkaiDisk} from "@/lib/client-translator";

export function AkaiDiskView() {
    const [disk, setDisk] = useState<AkaiDisk>(null)
    const [refresh, setRefresh] = useState(0)
    const [placeholder, setPlaceholder] = useState(<Skeleton variant="rectangular" width={210} height={118} />)
    useEffect(() => {
        getAkaiDisk().then(d => {
            if (d.errors.length === 0) {
                setDisk(d.data)
            } else {
                setPlaceholder(<Alert severity="error">{d.errors[0].message}</Alert>)
            }
        }).catch(e =>{
            setPlaceholder(<Alert severity="error">{String(e)}</Alert> )
        })
    }, [refresh])
    let items = 0

    function display() {
        return (
            <Card sx={{minWidth: '150px'}}>
                <CardHeader className="shadow-md" title="Your Disk So Far" subheader={disk.name}/>
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
                        setRefresh(refresh + 1)
                    }}><RefreshIcon/></Button>
                </CardActions>
            </Card>)
    }
    return disk ? display() : placeholder
}

function PartitionView({data, openDefault}: { data: AkaiPartition, openDefault: boolean }) {
    const [open, setOpen] = useState(openDefault)
    let items = 0
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><StorageIcon/></ListItemIcon>
                <ListItemText primary={`Part. ${data.name}`}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open}>
                <List sx={{width: '100%'}} dense={true} disablePadding>
                    {data.volumes.map(volume => {
                        items++
                        return (<VolumeView key={volume.name} openDefault={items === 1} data={volume}/>)
                    })}
                </List>
            </Collapse>
        </>
    )
}

function VolumeView({data, openDefault}: { data: AkaiVolume, openDefault: boolean }) {
    const [open, setOpen] = useState(openDefault)
    let items = 0
    return (<>
            <ListItemButton onClick={() => setOpen(!open)}>
                <ListItemIcon><SaveIcon/></ListItemIcon>
                <ListItemText primary={`Vol: ${path.parse(data.name).name}`}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
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
