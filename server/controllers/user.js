const sql = require('../db/mysql')

exports.get = (req, res) => {
    const user_id = req.params.id
    const queryCheckForUser = `SELECT id, first_name, last_name, email, image
    FROM users WHERE id = '${user_id}'`
    sql.query(queryCheckForUser, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForUser' })
        } else {
            if (result.length > 0) {
                res.send({ success: true, user: result[0] })
            } else {
                res.send({ success: false, msg: `There is no user with id '${user_id}' in the database` })
            }
        }
    })
}

exports.login = (req, res) => {
    const { name, picture, email, id } = req.body
    const [first_name, last_name] = name.split(' ')
    const queryCheckForUser = `SELECT id FROM users WHERE id = '${id}'`
    sql.query(queryCheckForUser, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForUser' })
        } else {
            if (result.length === 0) {
                const queryInsertUser = `INSERT INTO users (id, first_name, last_name, email, image)
                VALUES ('${id}', '${first_name}', '${last_name}', '${email}', '${picture.data.url}'`
                sql.query(queryInsertUser, (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryInsertUser' })
                    } else {
                        res.send({ success: true, msg: 'User added to the database' })
                    }
                })
            } else {
                res.send({ success: true, msg: 'User is already in the database' })
            }
        }
    })
}