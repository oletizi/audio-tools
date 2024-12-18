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
    onTranslate: (f: FileSpec | DirectorySpec) => void

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
        }, onTranslate(f: FileSpec | DirectorySpec): Promise<void> {
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
            .concat(data.directories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(item => {
                        const adornments: ItemAdornments = visit(item)
                        const deleteButton = adornments.deletable ? <IconButton onClick={() => {
                            adornments.onDelete(item)
                        }}><DeleteIcon/></IconButton> : ''
                        return (
                            <div key={seq()}>
                                <ListItem className="hover:bg-neutral-100">
                                    <div className="flex items-center h-full w-full" onClick={() => adornments.onClick(item)}>
                                        <ListItemIcon><FolderIcon/></ListItemIcon>
                                        <ListItemText>{item.name}</ListItemText>
                                    </div>
                                    {deleteButton}
                                </ListItem>
                                <Divider/></div>)
                    }
                ))
            .concat(data.files
                .sort((a, b) => {
                    const aAdornments = visit(a)
                    const bAdornments = visit(b)
                    if (aAdornments.translatable && bAdornments.translatable) {
                        return a.name.localeCompare(b.name)
                    } else if (aAdornments.translatable) {
                        return -1
                    } else if (bAdornments.translatable) {
                        return 1
                    }
                    return a.name.localeCompare(b.name)
                })
                .map(item => {
                    const adornments = visit(item)
                    const classes = adornments.translatable ? "hover:bg-neutral-100" : ""
                    const deleteButton = adornments.deletable ?
                        <IconButton onClick={() => adornments.onDelete(item)}><DeleteIcon/></IconButton> : ''
                    const translateButton = adornments.translatable ?
                        <IconButton onClick={() => adornments.onTranslate(item)}><ArrowForwardIcon/></IconButton> : ''

                    return (<div key={seq()}>
                        <ListItem className={classes} onClick={adornments.translatable ? () => {adornments.onTranslate(item)} : () => {}}>
                            <ListItemIcon><InsertDriveFileIcon/></ListItemIcon>
                            <ListItemText>{item.name}</ListItemText>
                            {deleteButton}
                            {translateButton}
                        </ListItem>
                        <Divider/></div>)
                }))
    }
    return (<List className={className}>{items}</List>)
}