import generateDashboard from './src/utils/generatedashboard';
import prisma from './src/app/lib/prisma';

async function test() {
    const mockUser = {
        id: 1,
        role: 'Admin',
        business: null
    };

    try {
        const data = await generateDashboard(mockUser);
        console.log("Super Admin Data Fetch Success");

        const mockSales = {
            id: 4,
            role: 'Sales person',
            business: 2
        };
        const salesData = await generateDashboard(mockSales);
        console.log("Salesperson Data Fetch Success");

    } catch (error) {
        console.error("Dashboard Generation Error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

test();
