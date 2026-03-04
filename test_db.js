const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        console.log("Checking DB connection...");
        await prisma.$connect();
        console.log("Connected.");

        console.log("Searching for user...");
        const user = await prisma.user.findFirst();
        console.log("Found user:", user ? user.email : "None");

        console.log("Searching for SuperAdmin...");
        const sa = await prisma.superAdmin.findFirst();
        console.log("Found SA:", sa ? sa.email : "None");

    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
