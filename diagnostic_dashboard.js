const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mock the generateDashboard function logic since I can't easily import ESM into CJS node without setup
// Actually, I'll just check if I can run the original generatedashboard.ts with some tweaks

async function test() {
    const userId = 4;
    const businessId = 2;

    try {
        // Test the logic I added to getSalespersonData
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const remindersToday = await prisma.lead.findMany({
            where: {
                deleted_at: null,
                nextFollowUp: {
                    gte: startOfToday,
                    lte: endOfToday
                },
                leadUsers: {
                    some: {
                        user_id: userId
                    }
                }
            },
            include: { stage: true },
            orderBy: { nextFollowUp: 'asc' }
        });
        console.log("Reminders Query Success:", remindersToday.length);
    } catch (error) {
        console.error("Reminders Query Failed:", error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
