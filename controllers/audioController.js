const fs = require("fs")
const jwt = require("jsonwebtoken")

const getAudioStream = (req, res) => {
    // console.log(req.cookies.audioToken)
    // console.log(jwt.verify(req.cookies.audioToken, process.env.AUDIO_TOKEN_SECRET))
    const audioToken= req.cookies.audioToken
    if (!audioToken){
        res.status(401).send("Missing Token")
    }
    const audioPath = jwt.verify(audioToken, process.env.AUDIO_TOKEN_SECRET).audioPath
    if (!audioPath){
        res.status(401).send("Missing Path")
    }
    const range = req.headers.range
    if (!range) {
        res.status(400).send("Requires Range header")
    }

    let parts = range.replace(/bytes=/, "").split("-")


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

const genTokenAudio = (req, res) => {
    const audioPath = req.params.path
    if (!audioPath){
        res.status(401).send("Invalid path")
    }
    const audioToken = jwt.sign({
        audioPath
    }, process.env.AUDIO_TOKEN_SECRET)
    res.status(202).cookie("audioToken", audioToken, {
        httpOnly: true
    }).json({
        audioToken: audioToken
    })
}
module.exports = {
    getAudioStream,
    genTokenAudio
}