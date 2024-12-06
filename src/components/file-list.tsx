import List from '@mui/material/list'
import {Divider, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder'
import {newSequence} from "@/lib/lib-core";
import {Directory, FileSet} from "@/lib/lib-fs-api";

const seq = newSequence('file-list')

export function join(items: [], separator) {
    return items.map((item, index) => (<>{item}{index < items.length - 1 ? separator() : ''}</>))
}

export function FileList({data, onSelect}: { data: FileSet | null, onSelect: (f:File | Directory) => void }) {
    let items = []
    // const data: FileSet = props.data
    onSelect = onSelect ? onSelect : (e) => {}
    if (data) {
        items = items
            .concat(data.directories.map(item =>
                (<><ListItemButton key={seq()} className="border-b-2" onClick={() => onSelect(item)}>
                    <ListItemIcon><FolderIcon/></ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                </ListItemButton><Divider/></>)
            ))
            .concat(data.files.map(item => (<><ListItem key={seq()} onClick={()=> onSelect(item)}>{item.name}</ListItem><Divider/></>)))
    }
    return (<List>{items}</List>)
}