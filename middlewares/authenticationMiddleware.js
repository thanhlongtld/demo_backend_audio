const jwt = require("jsonwebtoken")


const loginRequired = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send("Missing Token")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send("Verify Token failed")
        }
        req.user = user
        next()
    })
}

module.exports = {
    loginRequired
}