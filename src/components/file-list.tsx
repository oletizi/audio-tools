import List from '@mui/material/list'
import {Divider, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder'
import {newSequence} from "@/lib/lib-core";
import {FileSet} from "@/lib/lib-fs-api";

const seq = newSequence('file-list')

export function join(items: [], separator) {
    return items.map((item, index) => (<>{item}{index < items.length - 1 ? separator() : ''}</>))
}

export function FileList(props) {
    let items = []
    const data: FileSet = props.data
    const sourceSelect = props.sourceSelect
    if (data) {
        items = items
            .concat(data.directories.map(item =>
                (<><ListItemButton key={seq()} className="border-b-2">
                    <ListItemIcon><FolderIcon/></ListItemIcon>
                    <ListItemText>{item.name}</ListItemText>
                </ListItemButton><Divider/></>)
            ))
            .concat(data.files.map(item => (<><ListItem key={seq()}>{item.name}</ListItem><Divider/></>)))
        // items = join(items, () => <Divider key={seq()}/>)
    }
    return (<List {...props}>{items}</List>)
}