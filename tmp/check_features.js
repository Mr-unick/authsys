const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const businesses = await prisma.business.findMany();
    const features = await prisma.businessFeature.findMany();

    console.log("=== Businesses ===");
    console.log(JSON.stringify(businesses.map(b => ({ id: b.id, name: b.business_name })), null, 2));

    console.log("\n=== Features ===");
    console.log(JSON.stringify(features, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
