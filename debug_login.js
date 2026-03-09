
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const email = 'superadmin@leadconverter.ai';
    const user = await prisma.superAdmin.findUnique({ where: { email } });

    if (!user) {
        console.log('User not found');
        return;
    }

    const password = 'Admin@123';
    const isValid = bcrypt.compareSync(password, user.password);
    console.log(`Email: ${email}`);
    console.log(`Password Match: ${isValid}`);
    console.log(`Hash in DB: ${user.password}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
