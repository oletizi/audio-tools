import express from "express"
import fs from "fs/promises"

const app = express()
const port = 3000

app.get('/', async (req, res) => {
    try {
        res.status(200).contentType("text/html").send((await fs.readFile('build/site/index.html')).toString())
    } catch (err) {
        console.error(err)
        res.status(500).send("Barf.")
    }
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})