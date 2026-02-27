const mysql = require('mysql2/promise');

async function checkProcesses() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost', user: 'root', password: 'pass', database: 'authsys', port: 3306
        });
        const [rows] = await connection.execute('SHOW PROCESSLIST');
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) await connection.end();
    }
}
checkProcesses();
