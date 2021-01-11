var express = require("express")
var router = express.Router()

var {getAudioStream, genTokenAudio} = require("../controllers/audioController")
let {loginRequired} = require("../middlewares/authenticationMiddleware")
router.get("/:token", getAudioStream)
router.get("/gen_token/:path", loginRequired, genTokenAudio)

module.exports = router
