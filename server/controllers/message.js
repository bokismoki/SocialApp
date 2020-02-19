const sql = require('../db/mysql')

exports.getByUser = (req, res) => {
    const user_id = req.params.user_id
    const receiver_id = req.params.receiver_id
    const placeholder = [{ user_id }, { receiver_id }, { receiver_id: user_id }, { user_id: receiver_id }]
    const queryGetMessages = `SELECT m.id AS message_id, m.body_text,
    u.id AS user_id, u.image AS user_image,
    r.id AS receiver_id, r.image AS receiver_image
    FROM messages m
    JOIN users u ON u.id = m.user_id
    JOIN users r ON r.id = m.receiver_id
    WHERE (m.? AND m.?) OR (m.? AND m.?)
    ORDER BY m.created_at`
    sql.query(queryGetMessages, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetMessages' })
        } else {
            res.send({ success: true, messages: result })
        }
    })
}

exports.getPreviousChatUsers = (req, res) => {
    const user_id = req.params.id
    const placeholder = [{ user_id }, { receiver_id: user_id }]
    const queryGetPreviousChatUsers = `SELECT users.id AS user_id, CONCAT(users.first_name, ' ', users.last_name) AS name, users.image
    FROM messages
    JOIN users ON ((users.id = messages.user_id) OR (users.id = messages.receiver_id))
    WHERE (messages.? OR messages.?)
    GROUP BY users.id`
    sql.query(queryGetPreviousChatUsers, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetPreviousChatUsers' })
        } else {
            res.send({ success: true, previousChatUsers: result })
        }
    })
}

exports.add = (req, res) => {
    const { body_text, user_id, receiver_id } = req.body
    const placeholder = [body_text, user_id, receiver_id]
    const queryAddMessage = `INSERT INTO messages (body_text, user_id, receiver_id)
                VALUES (?, ?, ?)`
    sql.query(queryAddMessage, [...placeholder], (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryAddMessage' })
        } else {
            const id = result.insertId
            const queryGetNewMessage = `SELECT m.id AS message_id, m.body_text,
            u.id AS user_id, u.image AS user_image,
            r.id AS receiver_id, r.image AS receiver_image
            FROM messages m
            JOIN users u ON u.id = m.user_id
            JOIN users r ON r.id = m.receiver_id
            WHERE m.id = ${id}`
            sql.query(queryGetNewMessage, (err, result) => {
                if (err) {
                    res.send({ success: false, msg: 'Error on queryGetNewMessage' })
                } else {
                    res.send({ success: true, message: result[0] })
                }
            })
        }
    })
}