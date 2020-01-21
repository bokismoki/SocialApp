const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const queryCheckForPost = `SELECT id AS post_id, body_text, body_image, created_at, is_private
    FROM posts WHERE user_id = '${user_id}'
    ORDER BY created_at DESC`
    sql.query(queryCheckForPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForPost' })
        } else {
            res.send({ success: true, posts: result })
        }
    })
}

exports.getById = (req, res) => {
    const post_id = req.params.id
    const queryCheckForPost = `SELECT posts.id AS post_id, posts.body_text, posts.body_image, posts.created_at,
    posts.is_private, users.id AS user_id, users.first_name, users.last_name, users.image
    FROM posts JOIN users ON posts.user_id = users.id
    WHERE posts.id = ${post_id}`
    sql.query(queryCheckForPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForPost' })
        } else {
            res.send({ post: result[0] })
        }
    })
}

exports.getPublic = (req, res) => {
    const queryGetPublicPosts = `SELECT posts.id AS post_id, posts.body_text, posts.body_image, 
    posts.created_at, posts.is_private, users.id AS user_id, users.first_name, users.last_name, users.image
    FROM posts JOIN users ON users.id = posts.user_id
    WHERE posts.is_private = 0
    ORDER BY posts.created_at DESC`
    sql.query(queryGetPublicPosts, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetPublicPosts' })
        } else {
            res.send({ success: true, posts: result })
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
            FROM posts WHERE id = ${id}`
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