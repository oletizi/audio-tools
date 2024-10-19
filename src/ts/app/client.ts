import {FromList} from "./api";

doIt().then(()=>{console.log('done!')})
async function doIt() {
    const fromList = document.getElementById('from-list')
    const res = await fetch('/from-list/')
    const theList : FromList = await res.json()
    console.log(JSON.stringify(theList, null, 2))
    for (const e of theList.entries) {
        console.log(`element: ${e}`)
        const a = document.createElement('a')
        a.classList.add('list-group-item')
        a.classList.add('list-group-item-action')
        if (e.directory) {
            a.classList.add('fw-bold')
        }
        a.innerText = e.name
        fromList.appendChild(a)
    }
}
