import {DirList} from "./api";

doIt().then(() => {
    console.log('done!')
})

async function doIt() {
    await updateLists()
}

// XXX: This is a bad name
async function cdFromList(newdir: string) {
    console.log(`cd to ${newdir}`)
    let res = await fetch(`/cd/from?dir=${encodeURI(newdir)}`, {
        method: "POST",
    });
    let lists: DirList[] = await res.json();
    console.log(`cd complete. Updating from list...`)
    writeFromList(lists[0])
    console.log(`done updating from list.`)
}

async function cdToList(newdir: string) {
    let res = await fetch(`/cd/to?dir=${encodeURI(newdir)}`, {
        method: "POST",
    })
    let lists: DirList[] = await res.json()
    console.log(`cd complete. Updating to list...`)
    writeToList(lists[1])
    console.log('done updating to list.')
}

async function updateLists() {
    const res = await fetch('/list/')
    const lists: DirList[] = await res.json()
    writeFromList(lists[0])
    writeToList(lists[1])
}

function writeToList(theList: DirList) {
    const widget = document.getElementById('to-list')
    widget.innerText = ""
    for (const e of theList.entries) {
        const a = document.createElement('a')
        a.classList.add('list-group-item')
        if (e.directory) {
            a.classList.add('list-group-item-action')
            a.classList.add('fw-bold')
            a.onclick = async () => {
                await cdToList(e.name)
            }
        } else {
            a.classList.add('disabled')
            a.ariaDisabled = "true"
        }
        a.innerText = e.name
        widget.appendChild(a)
    }
}

function writeFromList(theList: DirList) {
    const widget = document.getElementById('from-list')
    widget.innerText = ""
    for (const e of theList.entries) {
        const a = document.createElement('a')
        a.classList.add('list-group-item')
        a.classList.add('list-group-item-action')
        if (e.directory) {
            a.classList.add('fw-bold')
            a.onclick = async () => {
                await cdFromList(e.name)
            }
        } else if (e.name.endsWith('.xpm')) {
            a.classList.add('mpc-program')
        } else {
            a.classList.add('disabled')
            a.ariaDisabled = "true"
        }
        a.innerText = e.name
        widget.appendChild(a)
    }
}