const mysql = require('mysql')

require('dotenv').config()

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'social_app'
})

mysqlConnection.connect(err => {
    if(err) {
        console.log('Error while connecting to the database', err)
    } else {
        console.log('Connected to the database')
    }
})

module.exports = mysqlConnection