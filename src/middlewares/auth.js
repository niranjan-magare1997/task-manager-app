const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async function (req, res, next) {
    console.log("New auth function")
    try {
        const token = req.header("Authorization").replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'task-manager-appp')
        const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token })

        if (!user) {
            throw new Error('User not found')
        }
        console.log(user)
        req.token = token
        req.user = user
        console.log(token, decodedToken)
        next()
    } catch (error) {
        res.status(401).send({ error: "Please authenticate with valid token." })
    }
}

module.exports = auth