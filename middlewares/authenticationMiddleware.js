const jwt = require("jsonwebtoken")
const axios = require("axios")

const loginRequired = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).send("Missing Token")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === "TokenExpiredError") {
                const refreshToken = req.cookies.refreshToken
                if (!refreshToken) {
                    return res.status(401).send("Error")
                }
                axios
                    .post(`http://localhost:4000/auth/token`, {refreshToken})
                    .then((response) => {
                        req.newAccessToken = response.data.token
                        next()
                    })
                    .catch((err) => {
                        return res.status(401).send(err)
                    })
            } else {
                return res.status(401).send("Verify Token failed")
            }

        } else {
            req.user = user
            next()
        }
    })
}

module.exports = {
    loginRequired
}