const fs=require("fs")

const getAudioStream= (req, res) => {
    const range = req.headers.range
    if (!range) {
        res.status(400).send("Requires Range header")
    }
    let parts = range.replace(/bytes=/, "").split("-")

    const audioPath = "test.mp3"
    const audioSize = fs.statSync(audioPath).size
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : audioSize - 1
    const contentLength = end - start + 1

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${audioSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "audio/mpeg",

    }
    res.writeHead(206, headers)
    const audioStream = fs.createReadStream(audioPath, {start, end})
    audioStream.pipe(res)
}
module.exports={
    getAudioStream
}