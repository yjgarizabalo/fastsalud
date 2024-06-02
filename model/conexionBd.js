const mysql = require('mysql');

let connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '0121ema',
        database: 'fastsalud'
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to the database:', err);
            setTimeout(handleDisconnect, 2000); // Reconectar después de 2 segundos
        }
    });

    connection.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect(); // Reconectar si la conexión se ha perdido
        } else {
            throw err;
        }
    });
}

handleDisconnect();

module.exports = connection;
