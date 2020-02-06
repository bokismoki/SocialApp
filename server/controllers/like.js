const sql = require('../db/mysql')

exports.set = (req, res) => {
    const { post_id, user_id } = req.body
    const queryCheckForLike = `SELECT * FROM likes
    WHERE post_id = ${post_id} && user_id = '${user_id}'`
    sql.query(queryCheckForLike, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForLike' })
        } else {
            if (result.length > 0) {
                const queryDislike = `DELETE FROM likes
                WHERE post_id = ${post_id} && user_id = '${user_id}'`
                sql.query(queryDislike, (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryDislike' })
                    } else {
                        res.send({ success: true, disliked: true })
                    }
                })
            } else {
                const queryLike = `INSERT INTO likes (user_id, post_id)
                VALUES('${user_id}', ${post_id})`
                sql.query(queryLike, (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryLike' })
                    } else {
                        res.send({ success: true, liked: true })
                    }
                })
            }
        }
    })
}