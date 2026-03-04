const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const businesses = await prisma.business.findMany();

    for (const business of businesses) {
        // Check if activity_log exists
        const existing = await prisma.businessFeature.findFirst({
            where: {
                business_id: business.id,
                feature_key: 'activity_log'
            }
        });

        if (!existing) {
            await prisma.businessFeature.create({
                data: {
                    business_id: business.id,
                    feature_key: 'activity_log',
                    is_enabled: true
                }
            });
            console.log(`Enabled activity_log for business: ${business.business_name} (${business.id})`);
        } else if (!existing.is_enabled) {
            await prisma.businessFeature.update({
                where: { id: existing.id },
                data: { is_enabled: true }
            });
            console.log(`Updated activity_log to ENABLED for business: ${business.business_name} (${business.id})`);
        } else {
            console.log(`Activity_log already active for business: ${business.business_name} (${business.id})`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
