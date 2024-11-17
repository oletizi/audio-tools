import express from "express"
import path from "path"
import {brain} from "./brain.ts"
import Queue from "queue";
import {PassThrough} from "stream";
import {newProgress} from "@/model/progress"
import {newClientConfig, saveClientConfig} from "./config-server";
import {newServerOutput} from "@/process-output";
import {ClientConfig} from "./config-client";
import {Result} from "@/lib/lib-core"

const app = express()
const port = 3000
const out = newServerOutput()
const homeDir = path.join(process.env.HOME, 'Dropbox', 'Music', 'Sampler Programs')
const targetDir = path.join(process.env.HOME, 'tmp')
const theBrain = new brain.Brain(homeDir, targetDir)
const workqueue = new Queue({results: [], autostart: true, concurrency: 1})
const progressqueue = new Queue({results: [], autostart: true, concurrency: 1})
const iostreamqueue = new Queue({results: [], autostart: true, concurrency: 1})
const iostream = new PassThrough()
const progress = newProgress()
iostream.pipe(process.stdout)

app.use(express.json())

app.use(express.static(path.join(process.cwd(), 'build', 'site', 'static'), {extensions: ['html']}))


// app.get('/', async (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'build', 'site', 'index.html'))
// })

// app.get('/s56k', (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'build', 'site', 'static', 's56k.html'))
// })

// app.get('/styles.css', async (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'build', 'site', 'static', 'styles.css'))
// })
//
// app.get('/client.js', async (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'build', 'site', 'client.js'))
// })

// app.get(`/s56k-client.js`, (req, res) => {
//     res.sendFile(path.join(process.cwd(), 'build', 'site', 's56k-client.js'))
// })

app.get('/config', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    newClientConfig().then((cfg) => {
        const result = {data: cfg}
        const body = JSON.stringify(result)
        out.log(`Sending config body: ${body}`)
        res.end(body)
    }).catch(err => {
        res.end(JSON.stringify({error: err.message}))
    })
})

app.post('/config/save', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    out.log(`Saving config...`)
    const cfg = req.body as ClientConfig
    out.log(`Config to save: ${JSON.stringify(cfg)}`)
    const result = {
        error: null,
        data: {}
    } as Result
    if (cfg && cfg.midiOutput) {
        try {
            console.log(`Trying to save config`)
            const configPath = await saveClientConfig(cfg)
            out.log(`Wrote config to: ${configPath}`)
            result.data.message = `Config saved.`
        } catch (err) {
            result.error = err
        }
    } else {
        result.data = {message: `Malformed config: ${JSON.stringify(cfg)}`}
    }
    res.end(JSON.stringify(result))
})

app.get('/list', async (req, res) => {
    let list = await theBrain.list();
    console.log(`Sending from list: ${list}`)
    res.send(list)
})

app.post('/cd/from', async (req, res) => {
    workqueue.push(async () => {
        iostream.write(`Moving to: ${req.query.dir}... `)
        await theBrain.cdFromDir(req.query.dir)
        iostream.write(`Done.\n`)
        res.send(await theBrain.list())
    })
})

app.post('/cd/to', async (req, res) => {
    workqueue.push(async () => {
        iostream.write(`Moving to: ${req.query.dir}... `)
        await theBrain.cdToDir(req.query.dir)
        iostream.write(`Done.\n`)
        res.send(await theBrain.list())
    })
})

app.post(`/mkdir`, async (req, res) => {
    workqueue.push(async () => {
        iostream.write(`New folder: ${req.query.dir}... `)
        await theBrain.newTargetDir(req.query.dir)
        iostream.write(`Done.\n`)
        res.send(await theBrain.list())
    })
})

app.post(`/program/translate`, async (req, res) => {
    workqueue.push(async () => {
        iostream.write(`Initiating translate... \n`)
        await theBrain.translate(req.query.name, iostream, progress)
        res.send(await theBrain.list())
        iostream.write(`Done translating ${req.query.name}.\n`)
        progress.reset()
    })
})

app.post('/rm/to', async (req, res) => {
    workqueue.push(async () => {
            iostream.write(`Removing: ${req.query.name}... `)
            await theBrain.rmTo(req.query.name)
            iostream.write(`Done.\n`)
            res.send(await theBrain.list())
        }
    )
})

app.get('/job/stream', async (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })
    iostreamqueue.shift()
    iostreamqueue.push(async () => {
        for await (const chunk of iostream) {
            res.write(chunk)
        }
        res.end()
    })
})

app.get('/job/progress', async (req, res) => {

    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    })
    progress.addListener((currentProgress: number) => {
        progressqueue.push(async () => {
            res.write(currentProgress.toString() + '\n')
        })
    })
})

app.listen(port, () => {
    console.log(`Converter app listening on port ${port}`)
})