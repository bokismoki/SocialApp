const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const body = req.body
    console.log(user_id, body)
}

exports.add = (req, res) => {
    const { type, user_id, receiver_id } = req.body
    let { post_id } = req.body
    if (!post_id) {
        post_id = null
    }
    const queryAddNotification = `INSERT INTO notifications (type, post_id, user_id, receiver_id)
    VALUES ('${type}', ${post_id}, '${user_id}', '${receiver_id}')`
    sql.query(queryAddNotification, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryAddNotification' })
        } else {
            res.send({ success: true })
        }
    })
}

exports.delete = (req, res) => {
    const notification_id = req.params.id
    const body = req.body
    console.log(notification_id, body)
}