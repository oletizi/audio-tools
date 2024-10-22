import express from "express"
import path from "path"
import {brain} from "./brain.ts"
import Queue from "queue";
import {PassThrough} from "stream";
import {newProgress} from "../progress";

const app = express()
const port = 3000

const homeDir = path.join(process.env.HOME, 'Dropbox', 'Music', 'Sampler Programs', 'MPC')
const targetDir = path.join(process.env.HOME, 'tmp')
const theBrain = new brain.Brain(homeDir, targetDir)
const workqueue = new Queue({results: [], autostart: true, concurrency: 1})
const progressqueue = new Queue({results: [], autostart: true, concurrency: 1})
const iostream = new PassThrough()
const progress = newProgress()
iostream.pipe(process.stdout)

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
    workqueue.push(async () => {
        await theBrain.newTargetDir(req.query.dir)
    })
    res.send(await theBrain.list())
})

app.post(`/program/translate`, async (req, res) => {
    workqueue.push(async () => {
        await theBrain.translate(req.query.name, iostream, progress)
        res.send(await theBrain.list())
        progress.reset()
    })
})

app.post('/rm/to', async (req, res) => {
    await theBrain.rmTo(req.query.name)
    res.send(await theBrain.list())
})

app.get('/job/stream', async (req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })
    for await (const chunk of iostream) {
        res.write(chunk)
    }
    res.end()
})

app.get('/job/progress', async (req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })
    progress.addListener((currentProgress: number) => {
        progressqueue.push(async () => {
            iostream.write(`Progress: ${currentProgress}\n`)
            res.write(currentProgress.toString() + '\n')
        })
    })
})

app.listen(port, () => {
    console.log(`Converter app listening on port ${port}`)
})