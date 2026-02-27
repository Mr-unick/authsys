const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create Super Admin
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const superAdmin = await prisma.superAdmin.upsert({
        where: { email: 'superadmin@leadconverter.ai' },
        update: {},
        create: {
            email: 'superadmin@leadconverter.ai',
            name: 'Super Admin',
            password: hashedPassword,
        },
    });
    console.log(`✅ SuperAdmin created: ${superAdmin.email}`);

    // 2. Seed Permissions
    const permissions = [
        { permission: 'leads', action: 'read', description: 'Can view leads' },
        { permission: 'leads', action: 'write', description: 'Can create/edit leads' },
        { permission: 'leads', action: 'delete', description: 'Can delete leads' },
        { permission: 'integrations', action: 'manage', description: 'Can manage integrations' },
        { permission: 'users', action: 'manage', description: 'Can manage business users' },
        { permission: 'settings', action: 'manage', description: 'Can manage business settings' },
        { permission: 'dashboard', action: 'read', description: 'Can view analytics' },
    ];

    for (const p of permissions) {
        const existing = await prisma.permission.findFirst({
            where: { permission: p.permission, action: p.action }
        });
        if (!existing) {
            await prisma.permission.create({ data: p });
        }
    }
    console.log(`✅ ${permissions.length} permissions checked/seeded`);

    // 3. Create a default Policy
    const policy = await prisma.policy.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Full Access',
            description: 'Provides access to all platform features',
        }
    });

    // Link permissions to policy (Note: Schema doesn't have PolicyPermission, it has Policy -> Permission relation)
    const allPermissions = await prisma.permission.findMany();
    for (const perm of allPermissions) {
        if (!perm.policy_id) {
            await prisma.permission.update({
                where: { id: perm.id },
                data: { policy_id: policy.id }
            });
        }
    }

    console.log('🚀 Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
