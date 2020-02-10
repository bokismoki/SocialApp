const sql = require('../db/mysql')

exports.getById = (req, res) => {
    const comment_id = req.params.id
    const placeholder = { id: comment_id }
    const queryGetComment = `SELECT comments.id AS comment_id, comments.body_text, comments.created_at,
    users.id AS user_id, users.first_name, users.last_name, users.image
    FROM comments JOIN users ON comments.user_id = users.id
    WHERE comments.?`
    sql.query(queryGetComment, placeholder, (err, result) => {
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
    const placeholder = { post_id }
    const queryGetComments = `SELECT comments.id AS comment_id, comments.body_text, comments.created_at,
    users.id AS user_id, users.first_name, users.last_name, users.image
    FROM comments JOIN users ON comments.user_id = users.id
    WHERE comments.?
    ORDER BY comments.created_at DESC
    LIMIT ${limit_index * 10}, 10`
    sql.query(queryGetComments, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetComments' })
        } else {
            res.send({ success: true, comments: result })
        }
    })
}

exports.getCountByPost = (req, res) => {
    const post_id = req.params.id
    const placeholder = { post_id }
    const queryGetCountByPost = `SELECT COUNT(id) AS comments_count FROM comments
    WHERE ?`
    sql.query(queryGetCountByPost, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetCountByPost' })
        } else {
            res.send({ success: true, comments_count: result[0].comments_count })
        }
    })
}

exports.add = (req, res) => {
    const { body_text, post_id, user_id } = req.body
    const placeholder = [body_text, post_id, user_id]
    const queryAddComment = `INSERT INTO comments (body_text, post_id, user_id)
    VALUES (?, ?, ?)`
    sql.query(queryAddComment, [...placeholder], (err, result) => {
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
    const placeholder = [{ body_text }, { id: comment_id }]
    const queryUpdateComment = `UPDATE comments SET ?
    WHERE ?`
    sql.query(queryUpdateComment, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryUpdateComment' })
        } else {
            res.send({ success: true, msg: 'Successfully updated comment' })
        }
    })
}

exports.delete = (req, res) => {
    const comment_id = req.params.id
    const placeholder = { id: comment_id }
    const queryDeleteComment = `DELETE FROM comments
    WHERE ?`
    sql.query(queryDeleteComment, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteComment' })
        } else {
            res.send({ success: true, msg: 'Comment successfully deleted' })
        }
    })
}