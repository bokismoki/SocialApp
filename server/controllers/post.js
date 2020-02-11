const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const limit_index = req.params.limit_index
    const queryGetPost = `SELECT p.id AS post_id, p.body_text, p.body_image, p.created_at, p.is_private,
    COALESCE(l.likes_count, 0) AS likes_count, COALESCE(c.comments_count, 0) AS comments_count
    FROM posts p
    LEFT JOIN ( SELECT post_id, COUNT(created_at) AS likes_count FROM likes GROUP BY post_id ) l ON l.post_id = p.id
    LEFT JOIN ( SELECT post_id, COUNT(created_at) AS comments_count FROM comments GROUP BY post_id ) c ON c.post_id = p.id
    WHERE p.user_id = '${user_id}'
    ORDER BY p.created_at DESC
    LIMIT ${limit_index * 15}, 15`
    sql.query(queryGetPost, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetPost' })
        } else {
            res.send({ success: true, posts: result })
        }
    })
}

exports.getCountByUser = (req, res) => {
    const user_id = req.params.id
    const placeholder = { user_id }
    const queryGetCountByUser = `SELECT COUNT(id) AS posts_count FROM posts
    WHERE ?`
    sql.query(queryGetCountByUser, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetCountByUser' })
        } else {
            res.send({ success: true, posts_count: result[0].posts_count })
        }
    })
}

exports.getById = (req, res) => {
    const post_id = req.params.id
    const placeholder = { id: post_id }
    const queryGetPost = `SELECT posts.id AS post_id, posts.body_text, posts.body_image, posts.created_at, posts.is_private,
    users.id AS user_id, users.first_name, users.last_name, users.image,
    COUNT(likes.created_at) AS likes_count
    FROM posts JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON likes.post_id = posts.id
    WHERE posts.?`
    sql.query(queryGetPost, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetPost' })
        } else {
            res.send({ success: true, post: result[0] })
        }
    })
}

exports.getPublic = (req, res) => {
    const limit_index = req.params.limit_index
    const queryGetPublicPosts = `SELECT p.id AS post_id, p.body_text, p.body_image, p.created_at, p.is_private,
    u.id AS user_id, u.first_name, u.last_name, u.image,
    COALESCE(l.likes_count, 0) AS likes_count, COALESCE(c.comments_count, 0) AS comments_count
    FROM posts p JOIN users u ON u.id = p.user_id
    LEFT JOIN ( SELECT post_id, COUNT(created_at) AS likes_count FROM likes GROUP BY post_id ) l ON l.post_id = p.id
    LEFT JOIN ( SELECT post_id, COUNT(created_at) AS comments_count FROM comments GROUP BY post_id ) c ON c.post_id = p.id
    WHERE p.is_private = 0
    ORDER BY p.created_at DESC
    LIMIT ${limit_index * 15}, 15`
    sql.query(queryGetPublicPosts, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetPublicPosts' })
        } else {
            res.send({ success: true, posts: result })
        }
    })
}

exports.getCountPublic = (req, res) => {
    const queryGetCountPublic = `SELECT COUNT(id) AS posts_count FROM posts WHERE is_private = 0`
    sql.query(queryGetCountPublic, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetCountPublic' })
        } else {
            res.send({ success: true, posts_count: result[0].posts_count })
        }
    })
}

exports.add = (req, res) => {
    const { body_text, body_image, is_private, user_id } = req.body
    const imageLength = body_image.length - 'data:image/png;base64,'.length
    const sizeInBytes = 4 * Math.ceil((imageLength / 3)) * 0.5624896334383812
    if (sizeInBytes > 2000000) {
        res.send({ success: false, msg: 'Image file is too large (max 2MB allowed)' })
    } else {
        const placeholder = [body_text, body_image, is_private, user_id]
        const queryAddPost = `INSERT INTO posts (body_text, body_image, is_private, user_id)
        VALUES (?, ?, ?, ?)`
        sql.query(queryAddPost, [...placeholder], (err, result) => {
            if (err) {
                console.log(err)
                res.send({ success: false, msg: 'Error on queryAddPost' })
            } else {
                const id = result.insertId
                const queryGetNewPost = `SELECT id AS post_id, body_text, body_image, created_at, is_private, user_id
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
}

exports.update = (req, res) => {
    const post_id = req.params.id
    const { body_text, body_image, is_private } = req.body
    const placeholder = [body_text, body_image, is_private, post_id]
    const queryUpdatePost = `UPDATE posts
    SET body_text = ?, body_image = ?, is_private = ?
    WHERE id = ?`
    sql.query(queryUpdatePost, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryUpdatePost' })
        } else {
            res.send({ success: true, msg: 'Successfully updated post' })
        }
    })
}

exports.delete = (req, res) => {
    const post_id = req.params.id
    const placeholer = { id: post_id }
    const queryDeletePost = `DELETE FROM posts
    WHERE ?`
    sql.query(queryDeletePost, placeholer, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeletePost' })
        } else {
            res.send({ success: true, msg: 'Post successfully deleted' })
        }
    })
}