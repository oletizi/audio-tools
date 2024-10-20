import {FromList} from "./api";

doIt().then(() => {
    console.log('done!')
})

async function doIt() {
    await updateFromList()
}

// XXX: This is a bad name
async function cdFromList(newdir: string) {
    console.log(`cd to ${newdir}`)
    let res = await fetch(`/cd/?dir=${encodeURI(newdir)}`, {
        method: "POST",
    });
    let theList: FromList = await res.json();
    console.log(`cd complete. Updating from list...`)
    writeFromList(theList)
    console.log(`done updating from list.`)
}

async function updateFromList() {
    const res = await fetch('/from-list/')
    const theList: FromList = await res.json()
    writeFromList(theList)
}

function writeFromList(theList: FromList) {
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
        }
        a.innerText = e.name
        widget.appendChild(a)
    }
}