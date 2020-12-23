const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")


app.use(cors())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.get("/audio", (req, res) => {
    const range = req.headers.range
    if (!range) {
        res.status(400).send("Requires Range header")
    }
    const audioPath = "test.mp3"
    const audioSize = fs.statSync(audioPath).size
    const CHUNK_SIZE = 10 ** 4
    const start = Number(range.replace(/\D/g, ""))
    const end = Math.min(start + CHUNK_SIZE, audioSize - 1)
    const contentLength = end - start + 1

    const headers = {
        "Content-Range":`bytes ${start}-${end}/${audioSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mpeg",

    }
    res.writeHead(206,headers)
    const audioStream= fs.createReadStream(audioPath,{start, end})
    audioStream.pipe(res)
})

app.listen(8000, () => {
    console.log("Listen on port 8000")
})