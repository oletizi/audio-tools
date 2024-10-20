import express from "express"
import path from "path"
import {brain} from "./brain.ts"

const app = express()
const port = 3000

const homeDir = path.join(process.env.HOME, 'Dropbox', 'Music', 'Sampler Programs', 'MPC')
const targetDir = path.join(process.env.HOME, 'tmp')
const theBrain = new brain.Brain(homeDir, targetDir)

app.get('/', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'index.html'))
})

app.get('/styles.css', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'styles.css'))
})

app.get('/client.js', async (req, res) => {
    res.sendFile(path.join(process.cwd(), 'build', 'site', 'client.js'))
})

app.get('/list', async (req, res) => {
    let list = await theBrain.list();
    console.log(`Sending from list: ${list}`)
    res.send(list)
})

app.post('/cd/from', async (req, res) => {
    await theBrain.cdFromDir(req.query.dir)
    res.send(await theBrain.list())
})

app.post('/cd/to', async (req, res) => {
    await theBrain.cdToDir(req.query.dir)
    res.send(await theBrain.list())
})

app.post(`/mkdir`, async (req, res) => {
    await theBrain.newTargetDir(req.query.dir)
    res.send(await theBrain.list())
})

app.post(`/program/translate`, async (req, res) => {
    await theBrain.translate(req.query.name)
    res.send(await theBrain.list())
})
app.listen(port, () => {
    console.log(`Converter app listening on port ${port}`)
})