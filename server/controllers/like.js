const sql = require('../db/mysql')

exports.set = (req, res) => {
    const { post_id, user_id } = req.body
    const placeholder = [{ post_id }, { user_id }]
    const queryCheckForLike = `SELECT * FROM likes
    WHERE ? && ?`
    sql.query(queryCheckForLike, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForLike' })
        } else {
            if (result.length > 0) {
                const placeholder2 = [{ post_id }, { user_id }]
                const queryDislike = `DELETE FROM likes
                WHERE ? && ?`
                sql.query(queryDislike, [...placeholder2], (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryDislike' })
                    } else {
                        res.send({ success: true, disliked: true })
                    }
                })
            } else {
                const placeholder3 = [user_id, post_id]
                const queryLike = `INSERT INTO likes (user_id, post_id)
                VALUES(?, ?)`
                sql.query(queryLike, [...placeholder3], (err, result) => {
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