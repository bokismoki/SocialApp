const mysql = require('mysql')

require('dotenv').config()

const mysqlConnection = mysql.createConnection(process.env.DB_CONNECT_URI)

mysqlConnection.connect(err => {
    if(err) {
        console.log('Error while connecting to the database', err)
    } else {
        console.log('Connected to the database')
    }
})

module.exports = mysqlConnection