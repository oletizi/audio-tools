import List from '@mui/material/List'
import ListItemButton from "@mui/material/ListItemButton";
import Divider from '@mui/material/Divider'
import FolderIcon from '@mui/icons-material/Folder'
import {newSequence} from "@/lib/lib-core";
import {DirectorySpec, FileSet} from "@/lib/lib-fs-api";
import {ListItem, ListItemIcon, ListItemText} from "@mui/material";

const seq = newSequence('file-list')

export function join(items: [], separator) {
    return items.map((item, index) => (<>{item}{index < items.length - 1 ? separator() : ''}</>))
}

export function FileList({data, onSelect}: { data: FileSet | null, onSelect: (f: File | DirectorySpec) => void }) {
    let items = []

    onSelect = onSelect ? onSelect : () => {}
    if (data) {
        items = items
            .concat(data.directories.map(item =>
                (<div key={seq()}><ListItemButton className="border-b-2" onClick={() => onSelect(item)}>
                    <ListItemIcon><FolderIcon/></ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                </ListItemButton><Divider/></div>)
            ))
            .concat(data.files.map(item => (<div key={seq()}><ListItem
                onClick={() => onSelect(item)}>{item.name}</ListItem><Divider/></div>)))
    }
    return (<List>{items}</List>)
}