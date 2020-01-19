const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const queryCheckForPost = `SELECT id, body_text, body_image,
    DATE_FORMAT(created_at, '%Y/%m/%d')AS post_created_at, is_private
    FROM posts WHERE user_id = '${user_id}'
    ORDER BY post_created_at DESC`
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