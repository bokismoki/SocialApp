const sql = require('../db/mysql')

exports.getByPost = (req, res) => {
    const post_id = req.params.id
    const queryCheckForLikes = `SELECT COUNT(*) AS likes_count FROM likes WHERE post_id = ${post_id}`
    sql.query(queryCheckForLikes, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForLikes' })
        } else {
            res.send({ success: true, likes: result[0] })
        }
    })
}