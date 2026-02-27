const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const business = await prisma.business.findFirst();
        console.log('Business record:', business ? 'Found' : 'Not found');
        if (business) {
            console.log('Columns:', Object.keys(business));
        }
    } catch (e) {
        console.error('Error fetching business:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
