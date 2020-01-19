const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const queryCheckForPost = `SELECT id, body_text, body_image, created_at, is_private
    FROM posts WHERE user_id = '${user_id}'
    ORDER BY created_at DESC`
    sql.query(queryCheckForPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForPost' })
        } else {
            if (result.length > 0) {
                res.send({ success: true, posts: result })
            }
        }
    })
}

exports.add = (req, res) => {
    const { body_text, body_image, is_private, user_id } = req.body
    const queryAddNewPost = `INSERT INTO posts (body_text, body_image, is_private, user_id)
    VALUES ('${body_text}', '${body_image}', '${is_private}', '${user_id}')`
    sql.query(queryAddNewPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryAddNewPost' })
        } else {
            const id = result.insertId
            const queryGetNewPost = `SELECT id, body_text, body_image, created_at, is_private
            FROM posts WHERE id = '${id}'`
            sql.query(queryGetNewPost, (err, result) => {
                if (err) {
                    res.send({ success: false, msg: 'Error on queryGetNewPost' })
                } else {
                    res.send({ success: true, post: result[0] })
                }
            })
        }
    })
}