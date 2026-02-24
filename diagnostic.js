const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const leads = await prisma.lead.findMany({
            take: 1
        });
        console.log("Field check - nextFollowUp:", leads[0] ? 'nextFollowUp' in leads[0] : 'No leads found');
    } catch (error) {
        console.error("Query Error:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
