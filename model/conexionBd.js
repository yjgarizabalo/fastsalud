var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'XNxuel1218',
    database: 'fastsalud'
})

module.exports = connection;