import express from "express"
import path from "path"
import {brain} from "./brain.ts"

const app = express()
const port = 3000
// const homeDir = path.join(process.env.HOME, 'Music')
const homeDir = path.join(process.cwd(), 'test', 'data')
const theBrain = new brain.Brain(homeDir)

app.get('/', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'index.html'))
})

app.get('/styles.css', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'styles.css'))
})

app.get('/client.js', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'client.js'))
})

app.get('/from-list', async (req, res) => {
    let fromList = await theBrain.getFromList();
    console.log(`Sending from list: ${fromList}`)
    res.send(fromList)
})

app.post('/cd', async (req, res) => {
    res.send(await theBrain.cd(req.query.dir))
})

app.listen(port, () => {
    console.log(`Converter app listening on port ${port}`)
})