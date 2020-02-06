const sql = require('../db/mysql')

exports.getById = (req, res) => {
    const comment_id = req.params.id
    const queryGetComment = `SELECT comments.id AS comment_id, comments.body_text, comments.created_at,
    users.id AS user_id, users.first_name, users.last_name, users.image
    FROM comments JOIN users ON comments.user_id = users.id
    WHERE comments.id = ${comment_id}`
    sql.query(queryGetComment, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetComment' })
        } else {
            res.send({ success: true, comment: result[0] })
        }
    })
}

exports.getByPost = (req, res) => {
    const post_id = req.params.id
    const limit_index = req.params.limit_index
    const queryGetComments = `SELECT comments.id AS comment_id, comments.body_text, comments.created_at,
    users.id AS user_id, users.first_name, users.last_name, users.image
    FROM comments JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ${post_id}
    ORDER BY comments.created_at DESC
    LIMIT ${limit_index * 10}, 10`
    sql.query(queryGetComments, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetComments' })
        } else {
            res.send({ success: true, comments: result })
        }
    })
}

exports.getCountByPost = (req, res) => {
    const post_id = req.params.id
    const queryGetCountByPost = `SELECT COUNT(id) AS comments_count FROM comments
    WHERE post_id = ${post_id}`
    sql.query(queryGetCountByPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetCountByPost' })
        } else {
            res.send({ success: true, comments_count: result[0].comments_count })
        }
    })
}

exports.add = (req, res) => {
    const { body_text, post_id, user_id } = req.body
    const queryAddComment = `INSERT INTO comments (body_text, post_id, user_id)
    VALUES ('${body_text}', ${post_id}, '${user_id}')`
    sql.query(queryAddComment, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryAddComment' })
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

exports.update = (req, res) => {
    const comment_id = req.params.id
    const { body_text } = req.body
    const queryUpdateComment = `UPDATE comments SET body_text = '${body_text}'
    WHERE id = ${comment_id}`
    sql.query(queryUpdateComment, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryUpdateComment' })
        } else {
            res.send({ success: true, msg: 'Successfully updated comment' })
        }
    })
}

exports.delete = (req, res) => {
    const comment_id = req.params.id
    const queryDeleteComment = `DELETE FROM comments
    WHERE id = ${comment_id}`
    sql.query(queryDeleteComment, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteComment' })
        } else {
            res.send({ success: true, msg: 'Comment successfully deleted' })
        }
    })
}