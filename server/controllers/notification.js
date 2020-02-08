const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const queryGetNotifications = `SELECT n.id AS notification_id, n.post_id, n.user_id, n.type,
    CONCAT(u.first_name, ' ', u.last_name) AS name, u.image, p.id AS post_id
    FROM notifications n
    JOIN users u ON u.id = n.user_id
    LEFT JOIN posts p ON p.id = n.post_id
    WHERE n.receiver_id = '${user_id}'
    ORDER BY n.created_at DESC`
    sql.query(queryGetNotifications, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetNotifications' })
        } else {
            res.send({ success: true, notifications: result })
        }
    })
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