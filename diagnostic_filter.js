const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const leads = await prisma.lead.findMany({
            where: {
                nextFollowUp: { not: null }
            },
            take: 1
        });
        console.log("Query Success with nextFollowUp filter");
    } catch (error) {
        console.log("Query Error with nextFollowUp filter:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
