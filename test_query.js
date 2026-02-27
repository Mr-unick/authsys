const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Querying businesses...');
    try {
        const businesses = await prisma.business.findMany({
            where: { deleted_at: null },
            include: {
                _count: {
                    select: { users: true, leads: true }
                }
            },
            take: 5
        });
        console.log('Success! Found:', businesses.length);
        console.log(JSON.stringify(businesses, null, 2));
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
