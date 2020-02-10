const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.id
    const placeholder = { receiver_id: user_id }
    const queryGetNotifications = `SELECT n.id AS notification_id, n.post_id, n.user_id, n.type,
    CONCAT(u.first_name, ' ', u.last_name) AS name, u.image, p.id AS post_id
    FROM notifications n
    JOIN users u ON u.id = n.user_id
    LEFT JOIN posts p ON p.id = n.post_id
    WHERE n.?
    ORDER BY n.created_at DESC`
    sql.query(queryGetNotifications, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetNotifications' })
        } else {
            res.send({ success: true, notifications: result })
        }
    })
}

exports.getCount = (req, res) => {
    const user_id = req.params.id
    const placeholder = { receiver_id: user_id }
    const queryGetNotificationsCount = `SELECT COUNT(id) AS notifications_count FROM notifications
    WHERE ?`
    sql.query(queryGetNotificationsCount, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetNotificationsCount' })
        } else {
            if (result[0].notifications_count === 0) {
                res.send({ success: true, hasNotifications: false })
            } else {
                res.send({ success: true, hasNotifications: true })
            }
        }
    })
}

exports.add = (req, res) => {
    const { type, user_id, receiver_id } = req.body
    let { post_id } = req.body
    if (!post_id) {
        post_id = null
    }
    const placeholder = [{ type }, { user_id }, { post_id }, { receiver_id }]
    let queryGetNotification = `SELECT id FROM notifications
    WHERE ? AND ? AND ? AND ?`
    if (!post_id) {
        queryGetNotification = `SELECT id FROM notifications
    WHERE ? AND ? AND ?`
    }
    sql.query(queryGetNotification, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetNotification' })
        } else {
            if (result.length === 0) {
                const placeholder2 = [type, post_id, user_id, receiver_id]
                const queryAddNotification = `INSERT INTO notifications (type, post_id, user_id, receiver_id)
                VALUES (?, ?, ?, ?)`
                sql.query(queryAddNotification, [...placeholder2], (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryAddNotification' })
                    } else {
                        res.send({ success: true })
                    }
                })
            }
        }
    })
}

exports.delete = (req, res) => {
    const notification_id = req.params.id
    const placeholder = { id: notification_id }
    const queryDeleteNotification = `DELETE FROM notifications
    WHERE ?`
    sql.query(queryDeleteNotification, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteNotification' })
        } else {
            res.send({ success: true, msg: 'Notification successfully deleted' })
        }
    })
}

exports.deleteAll = (req, res) => {
    const receiver_id = req.params.id
    const placeholder = { receiver_id }
    const queryDeleteAllNotifications = `DELETE FROM notifications WHERE ?`
    sql.query(queryDeleteAllNotifications, placeholder, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteAllNotifications' })
        } else {
            res.send({ success: true, msg: 'Notifications successfully deleted' })
        }
    })
}