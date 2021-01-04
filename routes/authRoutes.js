let router = require("express").Router()

const {login, token, logout} = require("../controllers/authController")

router.post("/login", login)
router.post("/token", token)
router.get("/logout", logout)

module.exports = router