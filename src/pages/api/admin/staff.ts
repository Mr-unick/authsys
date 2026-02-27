import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    // Only allow actual SuperAdmins (Owner) to manage staff
    // In our simplified logic, role === 'SUPER_ADMIN' means they are platform level
    // But maybe we only want the ROOT owner to manage other staff? 
    // For now, any SUPER_ADMIN can manage others if they have permission.
    if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
        try {
            const staff = await prisma.superAdmin.findMany({
                include: {
                    role: true
                },
                orderBy: { created_at: 'desc' }
            });

            // Return safe data
            const safeStaff = staff.map((s: any) => {
                const { password, ...rest } = s;
                return rest;
            });

            return res.status(200).json({ data: safeStaff });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, email, password, role_id } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email and password are required' });
            }

            const existing = await prisma.superAdmin.findUnique({ where: { email } });
            if (existing) return res.status(400).json({ message: 'Email already exists' });

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newStaff = await prisma.superAdmin.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role_id: role_id ? parseInt(role_id) : null,
                }
            });

            const { password: _, ...safeData } = newStaff;
            return res.status(201).json({ message: 'Staff member created', data: safeData });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, name, email, role_id, password } = req.body;

            const data: any = { name, email, role_id: role_id ? parseInt(role_id) : null };
            if (password) {
                data.password = bcrypt.hashSync(password, 10);
            }

            await prisma.superAdmin.update({
                where: { id: parseInt(id) },
                data
            });

            return res.status(200).json({ message: 'Staff member updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            // Prevent self-deletion if needed, or just allow it for now
            await prisma.superAdmin.delete({
                where: { id: parseInt(id as string) }
            });
            return res.status(200).json({ message: 'Staff member removed' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
