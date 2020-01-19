const sql = require('../db/mysql')

exports.login = (req, res) => {
    const { name, picture, email, id } = req.body
    const [first_name, last_name] = name.split(' ')
    const queryCheckForUser = `SELECT id FROM users WHERE id = '${id}'`
    sql.query(queryCheckForUser, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryCheckForUser' })
        } else {
            if (result.length === 0) {
                const queryInsertUser = `INSERT INTO users (id, first_name, last_name, email, avatar)
                               VALUES ('${id}', '${first_name}', '${last_name}', '${email}', '${picture.data.url}')`
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