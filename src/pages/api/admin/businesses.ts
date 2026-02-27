import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    if (user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    if (req.method === 'GET') {
        try {
            const businesses = await prisma.business.findMany({
                where: { deleted_at: null },
                include: {
                    _count: {
                        select: { users: true, leads: true }
                    }
                },
                orderBy: { created_at: 'desc' }
            });
            return res.status(200).json({ data: businesses });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        try {
            const { admin_name, admin_email, admin_password, ...businessData } = req.body;

            // Start a transaction to ensure all or nothing
            const result = await prisma.$transaction(async (tx) => {
                // 1. Create Business (Filter fields to avoid Prisma "Unknown field" errors)
                const business = await tx.business.create({
                    data: {
                        business_name: businessData.business_name,
                        gst_number: businessData.gst_number,
                        pan_number: businessData.pan_number,
                        business_address: businessData.business_address,
                        city: businessData.city,
                        state: businessData.state,
                        pin_code: businessData.pin_code,
                        contact_number: businessData.contact_number,
                        email: businessData.email,
                        owner_name: businessData.owner_name,
                        owner_contact: businessData.owner_contact,
                        owner_email: businessData.owner_email,
                        created_at: new Date(),
                    }
                });

                // 2. Auto-create initial lead stages
                const defaultStages = [
                    { stage_name: 'New Lead', colour: '#4E49F2', order: 0, business_id: business.id },
                    { stage_name: 'Contacted', colour: '#F59E0B', order: 1, business_id: business.id },
                    { stage_name: 'Qualified', colour: '#10B981', order: 2, business_id: business.id },
                    { stage_name: 'Negotiation', colour: '#8B5CF6', order: 3, business_id: business.id },
                    { stage_name: 'Closed Won', colour: '#22C55E', order: 4, business_id: business.id, stage_type: 'WON' },
                    { stage_name: 'Closed Lost', colour: '#EF4444', order: 5, business_id: business.id, stage_type: 'LOST' },
                ];
                await tx.leadStage.createMany({ data: defaultStages });

                // 3. Create default "Buisness Admin" Role
                const adminRole = await tx.role.create({
                    data: {
                        name: 'Buisness Admin',
                        business_id: business.id,
                        created_at: new Date(),
                    }
                });

                // 4. Create Admin User Account if details provided
                if (admin_email && admin_password) {
                    const hashedPassword = bcrypt.hashSync(admin_password, 10);
                    await tx.user.create({
                        data: {
                            name: admin_name || businessData.owner_name || 'Admin',
                            email: admin_email,
                            password: hashedPassword,
                            business_id: business.id,
                            role_id: adminRole.id,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    });
                }

                return business;
            });

            return res.status(201).json({ message: 'Business and Admin created successfully', data: result });
        } catch (error: any) {
            console.error("[BUSINESS_CREATE_ERROR]", error);
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, admin_name, admin_email, admin_password, ...data } = req.body;
            const business = await prisma.business.update({
                where: { id: parseInt(id) },
                data: {
                    business_name: data.business_name,
                    gst_number: data.gst_number,
                    pan_number: data.pan_number,
                    business_address: data.business_address,
                    city: data.city,
                    state: data.state,
                    pin_code: data.pin_code,
                    contact_number: data.contact_number,
                    email: data.email,
                    owner_name: data.owner_name,
                    owner_contact: data.owner_contact,
                    owner_email: data.owner_email,
                }
            });
            return res.status(200).json({ message: 'Business updated', data: business });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { id } = req.query;
            await prisma.business.update({
                where: { id: parseInt(id as string) },
                data: { deleted_at: new Date() }
            });
            return res.status(200).json({ message: 'Business deleted' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
