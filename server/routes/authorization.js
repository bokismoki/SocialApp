const jwt = require('jsonwebtoken')

require('dotenv').config()

module.exports = async (req, res, next) => {
    try {
        const cookiesHeader = req.headers['cookie']

        if (typeof cookiesHeader !== 'undefined') {

            const cookieToken = cookiesHeader.split('; ').find(header => header.includes('jwt=')).split('=')[1]

            const cookieDecode = await jwt.decode(cookieToken, process.env.JWT_SECRET)

            if (cookieDecode) {
                if (cookieDecode.user_id === req.body.user_id) {
                    next()
                } else {
                    throw 'Authorization Error'
                }
            } else {
                throw 'Authorization Error'
            }

        } else {
            throw 'Authorization Error'
        }
    } catch (err) {
        res.status(401).send({ success: false, msg: err })
    }
}