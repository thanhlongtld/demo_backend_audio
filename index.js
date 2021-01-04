const express = require("express")
const app = express()
const cors = require("cors")
const fs = require("fs")
const morganBody = require("morgan-body")
const bodyParser = require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const cookieParser= require("cookie-parser")
require("dotenv/config")


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cookieParser())


const audioRoute = require("./routes/audioRoute")
const userRoutes = require("./routes/userRoutes")

const log = fs.createWriteStream(
    path.join(__dirname, "logs", "express.log"), {flag: "a"}
)

morganBody(app, {
    noColors: true,
    prettify: false,
    logRequestId: true,
    stream: log
})

mongoose.connect(`${process.env.MONGODB_URL}`, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log("Connected to DB")
})
mongoose.set("useCreateIndex", true)

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.use("/audio", audioRoute)
app.use("/users", userRoutes)

// app.get("/login",(req,res)=>{
//
// })

app.listen(8000, () => {
    console.log("Listen on port 8000")
})