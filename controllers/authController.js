const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const login = async (req, res) => {
    const user = await User.findOne({username: req.body.username})
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
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "2 days"})
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15s"})
}

const token = (req, res) => {
    const refreshToken = req.body.refreshToken
    if (!refreshToken) return res.status(401)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403)
        const accessToken = generateAccessToken({
            username: user.username,
            _id: user._id
        })
        res.json(accessToken)
    })
}
module.exports = {
    login,
    token
}