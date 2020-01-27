const jwt = require('jsonwebtoken')

require('dotenv').config()

module.exports = async (req, res, next) => {
    const cookiesHeader = req.headers['cookie']
    const cookieToken = cookiesHeader.split('; ')[5].split('=')[1]

    if (typeof cookiesHeader !== 'undefined') {

        const cookieDecode = await jwt.decode(cookieToken, process.env.JWT_SECRET)

        if (cookieDecode) {
            if (cookieDecode.user_id === req.body.user_id) {
                next()
            } else {
                res.send(401, { success: false, msg: 'Authorization Error' })
            }
        } else {
            res.send(401, { success: false, msg: 'Authorization Error' })
        }

    } else {
        res.send(401, { success: false, msg: 'Authorization Error' })
    }
}