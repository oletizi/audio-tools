import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import List from '@mui/material/List'
import ListItemButton from "@mui/material/ListItemButton";
import Divider from '@mui/material/Divider'
import FolderIcon from '@mui/icons-material/Folder'
import DeleteIcon from '@mui/icons-material/Delete'
import {newSequence} from "@/lib/lib-core";
import {DirectorySpec, FileSet, FileSpec} from "@/lib/lib-fs-api";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

const seq = newSequence('file-list')

export interface ItemAdornments {
    clickable: boolean
    onClick: (f: FileSpec | DirectorySpec) => void

    translatable: boolean
    onTransform: (f: FileSpec | DirectorySpec) => void

    deletable: boolean
    onDelete: (f: FileSpec | DirectorySpec) => void
}

export interface visitItem {
    (f: FileSpec | DirectorySpec): ItemAdornments
}

const nullVisitItem: visitItem = () => {
    const rv: ItemAdornments = {
        clickable: false, deletable: false, onClick(f: FileSpec | DirectorySpec): Promise<void> {
            return Promise.resolve(undefined);
        }, onDelete(f: FileSpec | DirectorySpec): Promise<void> {
            return Promise.resolve(undefined);
        }, onTransform(f: FileSpec | DirectorySpec): Promise<void> {
            return Promise.resolve(undefined);
        }, translatable: false
    }
    return rv
}

export function join(items: [], separator) {
    return items.map((item, index) => (<>{item}{index < items.length - 1 ? separator() : ''}</>))
}

export function FileList({data, className, visit = nullVisitItem}: {
    data: FileSet | null,
    className: string,
    visit: visitItem
}) {
    let items = []

    if (data) {
        items = items
            .concat(data.directories.map(item => {
                    const adornments: ItemAdornments = visit(item)
                    const deleteButton = adornments.deletable ? <IconButton onClick={() => {
                        adornments.onDelete(item)
                    }}><DeleteIcon/></IconButton> : ''
                    return (
                        <div key={seq()}>
                            <ListItem>
                                <ListItemButton onClick={() => adornments.onClick(item)}>
                                    <ListItemIcon><FolderIcon/></ListItemIcon>
                                    <ListItemText>{item.name}</ListItemText>
                                </ListItemButton>
                                {deleteButton}
                            </ListItem>
                            <Divider/></div>)
                }
            ))
            .concat(data.files.map(item => {
                const adornments = visit(item)
                const deleteButton = adornments.deletable ?
                    <IconButton onClick={() => adornments.onDelete(item)}><DeleteIcon/></IconButton> : ''
                const translateButton = adornments.translatable ?
                    <IconButton onClick={() => adornments.onTransform(item)}><ArrowForwardIcon/></IconButton> : ''

                return (<div key={seq()}>
                    <ListItem>
                        <ListItemButton>
                            <ListItemIcon><InsertDriveFileIcon/></ListItemIcon>
                            <ListItemText>{item.name}</ListItemText>
                        </ListItemButton>
                        {deleteButton}
                        {translateButton}
                    </ListItem>
                    <Divider/></div>)
            }))
    }
    return (<List className={className}>{items}</List>)
}