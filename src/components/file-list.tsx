import List from '@mui/material/List'
import ListItemButton from "@mui/material/ListItemButton";
import Divider from '@mui/material/Divider'
import FolderIcon from '@mui/icons-material/Folder'
import {newSequence} from "@/lib/lib-core";
import {DirectorySpec, FileSet, FileSpec} from "@/lib/lib-fs-api";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

const seq = newSequence('file-list')

export interface ItemAdornments {
    clickable: boolean
    onClick: (f: FileSpec | DirectorySpec) => void

    transformable: boolean
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
        }, transformable: false
    }
    return rv
}

export function join(items: [], separator) {
    return items.map((item, index) => (<>{item}{index < items.length - 1 ? separator() : ''}</>))
}

export function FileList({data, onSelect, className, visit = nullVisitItem}: {
    data: FileSet | null,
    onSelect: (f: FileSpec | DirectorySpec) => void,
    className: string,
    visitor: visitItem
}) {
    let items = []

    onSelect = onSelect ? onSelect : () => {
    }
    if (data) {
        items = items
            .concat(data.directories.map(item => {
                    const adornments = visit(item)
                    return (<div key={seq()}><ListItemButton className="border-b-2" onClick={() => onSelect(item)}>
                        <ListItemIcon><FolderIcon/></ListItemIcon>
                        <ListItemText>{item.name}</ListItemText>
                    </ListItemButton><Divider/></div>)
                }
            ))
            .concat(data.files.map(item => {
                const adornments = visit(item)
                return (<div key={seq()}><ListItem
                    onClick={() => onSelect(item)}>{item.name}</ListItem><Divider/></div>)
            }))
    }
    return (<List className={className}>{items}</List>)
}