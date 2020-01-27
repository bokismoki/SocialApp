const mysql = require('mysql')

require('dotenv').config()

const mysqlConnection = mysql.createPool(process.env.DB_CONNECT_URI)

module.exports = mysqlConnection