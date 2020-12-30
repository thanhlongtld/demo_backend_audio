let router = require("express").Router()
const {createUser,testToken} = require("../controllers/userController")
const {loginRequired}=require("../middlewares/authenticationMiddleware")

router.post("/create", createUser)
router.get("/test_token",loginRequired,testToken)
module.exports=router
