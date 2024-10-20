import {DirList} from "./api";

doIt().then(() => {
    console.log('done!')
})

async function doIt() {
    const newdirButton = document.getElementById('newdir')
    newdirButton.onclick = async () => {
        await newDir()
    }
    await updateLists()
}

async function newDir() {
    const nameField = document.getElementById('newdir-name')
    const dirname = nameField.value
    console.log(`New directory name: ${dirname}`)
    let res = await fetch(`/mkdir/?dir=${encodeURI(dirname)}`, {
        method: "POST",
    })
    let lists: DirList[] = await res.json()
    writeToList(lists[1])
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
        a.innerText = e.name + ` `
        if (e.directory) {
            a.classList.add('fw-bold')
            a.onclick = async () => {
                await cdFromList(e.name)
            }
        } else if (e.name.endsWith('.xpm')) {
            a.classList.add('mpc-program')
            const span = document.createElement('span')
            span.classList.add('badge')
            span.classList.add('bg-secondary')
            span.innerText = '›'
            a.appendChild(span)
            a.onclick = async () => {
                await transformProgram(e.name)
            }
        } else {
            a.classList.add('disabled')
            a.ariaDisabled = "true"
        }
        widget.appendChild(a)
    }
}

async function transformProgram(programName) {
    const res = await fetch(`/transform/?name=${encodeURI(programName)}`)
    const lists = await res.json()
    writeToList(lists[1])
}