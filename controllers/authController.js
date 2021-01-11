const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    let user=undefined;
    try{
      user  = await User.findOne({username: req.body.username})
    }
    catch (err){
        return res.status(500).send()
    }

    if (!user) {
        return res.status(400).send("Invalid username")
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = generateAccessToken({
                username: user.username,
                _id: user._id
            })
            const refreshToken = jwt.sign({
                username: user.username,
                _id: user._id
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5m'})
            res.status(202).cookie("refreshToken", refreshToken, {
                httpOnly: true
            }).json({
                accessToken: accessToken
            })
        } else {
            res.send("Wrong Password")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
}

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "5s"})
}

const token = (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.status(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err){
            return res.status(403).send("Cannot Refresh")
        }
        const accessToken = generateAccessToken({
            username: user.username,
            _id: user._id
        })
        res.json({token: accessToken})
    })
}

const logout = (req,res)=>{
    res.status(200).clearCookie("refreshToken").send("clear")
}
module.exports = {
    login,
    token,
    logout
}