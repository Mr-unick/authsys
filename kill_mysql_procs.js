const mysql = require('mysql2/promise');

async function killLocks() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost', user: 'root', password: 'pass', database: 'authsys', port: 3306
        });
        const [rows] = await connection.execute('SHOW PROCESSLIST');
        console.log(`Found ${rows.length} processes.`);

        for (const row of rows) {
            if (row.User !== 'event_scheduler' && row.Command !== 'Killed' && row.Id !== 5) {
                // Don't kill our own connection if possible, though it's usually at the end
                // We'll just try to kill everything that's not us.
                // Actually, we can check row.Id !== connection.threadId
                if (row.Id !== connection.threadId) {
                    console.log(`Killing process ${row.Id} (${row.User}, ${row.State})`);
                    try {
                        await connection.execute(`KILL ${row.Id}`);
                    } catch (e) {
                        console.error(`Failed to kill ${row.Id}: ${e.message}`);
                    }
                }
            }
        }
        console.log('Cleanup attempt complete.');
    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) await connection.end();
    }
}
killLocks();
