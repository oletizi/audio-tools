import express from "express"
import fs from "fs/promises"
import path from "path"

const app = express()
const port = 3000


app.get('/', async (req, res) => {
    try {
        // res.status(200).set('Content-Type', 'text/html').send((await fs.readFile('build/site/index.html')).toString())
        res.sendFile(path.join(process.cwd(), 'build', 'site', 'index.html'))
    } catch (err) {
        console.error(err)
        res.status(500).send("Barf.")
    }
})


app.listen(port, () => {
    console.log(`Converter app listening on port ${port}`)
})