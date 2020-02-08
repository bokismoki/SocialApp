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

exports.getCount = (req, res) => {
    const user_id = req.params.id
    const queryGetNotificationsCount = `SELECT COUNT(id) AS notifications_count FROM notifications
    WHERE receiver_id = '${user_id}'`
    sql.query(queryGetNotificationsCount, (err, result) => {
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
    let queryGetNotification = `SELECT id FROM notifications
    WHERE type = '${type}' AND user_id = '${user_id}' AND post_id = ${post_id} AND receiver_id = '${receiver_id}'`
    if (!post_id) {
        queryGetNotification = `SELECT id FROM notifications
    WHERE type = '${type}' AND user_id = '${user_id}' AND receiver_id = '${receiver_id}'`
    }
    sql.query(queryGetNotification, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetNotification' })
        } else {
            if (result.length === 0) {
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
        }
    })
}

exports.delete = (req, res) => {
    const notification_id = req.params.id
    const queryDeleteNotification = `DELETE FROM notifications
    WHERE id = ${notification_id}`
    sql.query(queryDeleteNotification, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteNotification' })
        } else {
            res.send({ success: true, msg: 'Notification successfully deleted' })
        }
    })
}

exports.deleteAll = (req, res) => {
    const receiver_id = req.params.id
    const queryDeleteAllNotifications = `DELETE FROM notifications WHERE receiver_id = '${receiver_id}'`
    sql.query(queryDeleteAllNotifications, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryDeleteAllNotifications' })
        } else {
            res.send({ success: true, msg: 'Notifications successfully deleted' })
        }
    })
}