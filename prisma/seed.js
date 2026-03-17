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

    // 2. Seed Permissions and Policies (Modules)
    const modules = [
        {
            name: 'Dashboard',
            description: 'Dashboard Analytics',
            permissions: [
                { permission: 'view_dashboard', action: 'read', description: 'Can view dashboard analytics' },
            ]
        },
        {
            name: 'Leads',
            description: 'Lead Management Module',
            permissions: [
                { permission: 'view_leads', action: 'read', description: 'Can view leads list' },
                { permission: 'create_lead', action: 'write', description: 'Can create new leads' },
                { permission: 'update_lead', action: 'write', description: 'Can update existing leads' },
                { permission: 'delete_lead', action: 'delete', description: 'Can delete leads' },
                { permission: 'assign_leads', action: 'manage', description: 'Can assign leads to users' },
                { permission: 'import_leads', action: 'manage', description: 'Can upload leads in bulk' },
                { permission: 'view_lead_details', action: 'read', description: 'Can view full lead information' },
            ]
        },
        {
            name: 'Users',
            description: 'User Management Module',
            permissions: [
                { permission: 'view_users', action: 'read', description: 'Can view team members' },
                { permission: 'create_user', action: 'write', description: 'Can add new users' },
                { permission: 'update_user', action: 'write', description: 'Can update user details' },
                { permission: 'delete_user', action: 'delete', description: 'Can remove users' },
            ]
        },
        {
            name: 'Branches',
            description: 'Branch Management Module',
            permissions: [
                { permission: 'view_branches', action: 'read', description: 'Can view business branches' },
                { permission: 'create_branch', action: 'write', description: 'Can create new branches' },
                { permission: 'update_branch', action: 'write', description: 'Can update branch info' },
                { permission: 'delete_branch', action: 'delete', description: 'Can delete branches' },
            ]
        },
        {
            name: 'Roles',
            description: 'Role & Permissions Module',
            permissions: [
                { permission: 'view_roles', action: 'read', description: 'Can view access roles' },
                { permission: 'create_role', action: 'write', description: 'Can create custom roles' },
                { permission: 'update_role', action: 'write', description: 'Can update role permissions' },
                { permission: 'delete_role', action: 'delete', description: 'Can delete roles' },
            ]
        },
        {
            name: 'Stages',
            description: 'Lead Stages Configuration Module',
            permissions: [
                { permission: 'view_stages', action: 'read', description: 'Can view lead stages' },
                { permission: 'create_stage', action: 'write', description: 'Can create new stages' },
                { permission: 'update_stage', action: 'write', description: 'Can update stage workflow' },
                { permission: 'delete_stage', action: 'delete', description: 'Can delete stages' },
            ]
        },
        {
            name: 'Operations',
            description: 'Business Operations Module',
            permissions: [
                { permission: 'view_area_of_operation', action: 'read', description: 'Can view service areas' },
                { permission: 'create_area_of_operation', action: 'write', description: 'Can add new areas' },
                { permission: 'update_area_of_operation', action: 'write', description: 'Can edit areas' },
                { permission: 'delete_area_of_operation', action: 'delete', description: 'Can remove areas' },
            ]
        },


        {
            name: 'Integrations',
            description: 'System Integrations Module',
            permissions: [
                { permission: 'view_integrations', action: 'read', description: 'Can view connected apps' },
                { permission: 'manage_integrations', action: 'manage', description: 'Can setup/remove integrations' },
            ]
        },
        {
            name: 'Settings',
            description: 'Business Settings Module',
            permissions: [
                { permission: 'view_settings', action: 'read', description: 'Can view business settings' },
                { permission: 'update_settings', action: 'write', description: 'Can modify business info' },
            ]
        },
        {
            name: 'Lead Details',
            description: 'Advanced Lead Operations Module',
            permissions: [
                { permission: 'view_discussion', action: 'read', description: 'Can view lead discussions' },
                { permission: 'view_stage_pipeline', action: 'read', description: 'Can view lead stage pipeline' },
                { permission: 'add_comment', action: 'write', description: 'Can add comments to lead' },
                { permission: 'update_stage', action: 'write', description: 'Can update lead stage' },
                { permission: 'add_followup', action: 'write', description: 'Can add scheduled follow-ups' },
            ]
        }
    ];

    for (const module of modules) {
        // Create or update policy
        const policy = await prisma.policy.upsert({
            where: { id: modules.indexOf(module) + 1 },
            update: {
                name: module.name,
                description: module.description
            },
            create: {
                id: modules.indexOf(module) + 1,
                name: module.name,
                description: module.description
            }
        });

        for (const p of module.permissions) {
            const permissionUniqueId = module.permissions.indexOf(p) + (modules.indexOf(module) * 10) + 1;
            await prisma.permission.upsert({
                where: { id: permissionUniqueId },
                update: {
                    permission: p.permission,
                    action: p.action,
                    description: p.description,
                    policy_id: policy.id
                },
                create: {
                    id: permissionUniqueId,
                    permission: p.permission,
                    action: p.action,
                    description: p.description,
                    policy_id: policy.id
                }
            });
        }
    }

    console.log(`✅ ${modules.length} modules and permissions seeded`);


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
