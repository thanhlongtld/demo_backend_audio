let router = require("express").Router()

const {login, token} = require("../controllers/authController")

router.post("/login", login)
router.post("/token", token)

module.exports = router