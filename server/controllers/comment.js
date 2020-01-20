const sql = require('../db/mysql')

exports.add = (req, res) => {
    const { body_text, post_id, user_id } = req.body
    const queryAddNewComment = `INSERT INTO comments (body_text, post_id, user_id)
    VALUES ('${body_text}', ${post_id}, '${user_id}')`
    sql.query(queryAddNewComment, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryAddNewComment' })
        } else {
            const id = result.insertId
            const queryGetNewComment = `SELECT comments.id AS comment_id, comments.body_text, comments.created_at,
            users.id AS user_id, users.first_name, users.last_name, users.image
            FROM comments JOIN users ON comments.user_id = users.id
            WHERE comments.id = ${id}`
            sql.query(queryGetNewComment, (err, result) => {
                if (err) {
                    res.send({ success: false, msg: 'Error on queryGetNewComment' })
                } else {
                    res.send({ success: true, comment: result[0] })
                }
            })
        }
    })
}