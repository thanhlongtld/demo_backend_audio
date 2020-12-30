var express= require("express")
var router = express.Router()

var {getAudioStream} = require("../controllers/audioController")

router.get("/",  getAudioStream)

module.exports = router
