import prisma from './src/app/lib/prisma';

async function test() {
    try {
        const leads = await (prisma.lead as any).findMany({
            where: {
                nextFollowUp: { not: null }
            },
            take: 1
        });
        console.log("DB Query Success:", leads);
    } catch (error) {
        console.error("DB Query Failed:", error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
