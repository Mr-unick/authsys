const mysql = require('mysql2/promise');

async function fixDb() {
    let connection;
    try {
        console.log('Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pass',
            database: 'authsys',
            port: 3306
        });

        console.log('Connected.');

        const columnsToAdd = [
            { name: 'subscription_status', sql: "ALTER TABLE business ADD COLUMN subscription_status VARCHAR(255) DEFAULT 'INACTIVE'" },
            { name: 'subscription_plan', sql: "ALTER TABLE business ADD COLUMN subscription_plan VARCHAR(255) DEFAULT 'BASIC'" },
            { name: 'trial_expiry', sql: "ALTER TABLE business ADD COLUMN trial_expiry TIMESTAMP NULL" },
            { name: 'is_on_trial', sql: "ALTER TABLE business ADD COLUMN is_on_trial BOOLEAN DEFAULT FALSE" }
        ];

        for (const col of columnsToAdd) {
            try {
                await connection.execute(col.sql);
                console.log(`Column ${col.name} added.`);
            } catch (err) {
                if (err.errno === 1060) { // Duplicate column name
                    console.log(`Column ${col.name} already exists.`);
                } else {
                    console.error(`Error adding ${col.name}:`, err.message);
                }
            }
        }

        console.log('Creating business_feature table...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS business_feature (
        id INT AUTO_INCREMENT PRIMARY KEY,
        business_id INT NOT NULL,
        feature_key VARCHAR(100) NOT NULL,
        is_enabled BOOLEAN DEFAULT FALSE,
        UNIQUE(business_id, feature_key)
      )
    `);
        console.log('Table business_feature verified.');

        console.log('Database fix complete.');
    } catch (err) {
        console.error('Failed to fix DB:', err.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixDb();
