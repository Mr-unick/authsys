const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Adding subscription columns...');
        // MySQL ALTER TABLE ... ADD COLUMN IF NOT EXISTS is only available in 8.0.19+ 
        // We'll use a safer approach: check if column exists first or just catch errors

        const alterColumns = [
            "ALTER TABLE business ADD COLUMN subscription_status VARCHAR(255) DEFAULT 'INACTIVE'",
            "ALTER TABLE business ADD COLUMN subscription_plan VARCHAR(255) DEFAULT 'BASIC'",
            "ALTER TABLE business ADD COLUMN trial_expiry TIMESTAMP NULL",
            "ALTER TABLE business ADD COLUMN is_on_trial BOOLEAN DEFAULT FALSE"
        ];

        for (const sql of alterColumns) {
            try {
                await prisma.$executeRawUnsafe(sql);
                console.log('Success:', sql);
            } catch (err) {
                console.log('Skipped or Failed (already exists?):', sql);
            }
        }

        console.log('Creating business_feature table...');
        try {
            await prisma.$executeRawUnsafe("CREATE TABLE IF NOT EXISTS business_feature (id INT AUTO_INCREMENT PRIMARY KEY, business_id INT NOT NULL, feature_key VARCHAR(100) NOT NULL, is_enabled BOOLEAN DEFAULT FALSE, UNIQUE(business_id, feature_key))");
            console.log('Table business_feature verified.');
        } catch (err) {
            console.error('Table creation failed:', err.message);
        }

        console.log('Database manual sync attempt complete.');
    } catch (e) {
        console.error('Migration crashed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
