const sql = require('../db/mysql')

exports.get = (req, res) => {
    const user_id = req.params.id
    const queryGetUser = `SELECT id, first_name, last_name, email, image
    FROM users WHERE id = '${user_id}'`
    sql.query(queryGetUser, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetUser' })
        } else {
            if (result.length > 0) {
                res.send({ success: true, user: result[0] })
            } else {
                res.send({
                    success: false,
                    msg: 'Error on queryGetUser'
                })
            }
        }
    })
}

exports.login = (req, res) => {
    const { name, picture, email, id } = req.body
    const [first_name, last_name] = name.split(' ')
    const queryGetUser = `SELECT id FROM users WHERE id = '${id}'`
    sql.query(queryGetUser, (err, result) => {
        if (err) {
            res.send({ success: false, msg: 'Error on queryGetUser' })
        } else {
            if (result.length === 0) {
                const queryAddUser = `INSERT INTO users (id, first_name, last_name, email, image)
                VALUES ('${id}', '${first_name}', '${last_name}', '${email}', '${picture.data.url}'`
                sql.query(queryAddUser, (err, result) => {
                    if (err) {
                        res.send({ success: false, msg: 'Error on queryAddUser' })
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