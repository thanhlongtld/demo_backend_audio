const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
        res.status(400).send("Missing parameters")
    }
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save((err, newUser) => {
            if (err) {
                if (err.keyValue.hasOwnProperty("username")) {
                    return res.status(400).send("Username existed")
                }
                return res.status(400).send("Error")

            }
            res.json({
                message: "Success"
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).send("Something went wrong")
    }
}




const testToken = (req, res) => {
    res.json({newAccessToken:req.newAccessToken})
}

module.exports = {
    createUser,
    testToken
}