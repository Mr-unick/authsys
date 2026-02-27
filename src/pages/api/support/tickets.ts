import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    if (req.method === 'GET') {
        try {
            const role = (user.role || 'USER').toUpperCase().replace(/\s+/g, '_');
            const businessId = user.business;
            console.log(`[DEBUG] Fetching tickets for Role: ${role}, BusinessId: ${businessId}`);

            let tickets;

            // Revised check for Super Admin / Portal Staff
            const isPortalAdmin = role === 'SUPER_ADMIN' || (role === 'ADMIN' && !businessId);

            if (isPortalAdmin) {
                // Portal Admin sees all tickets
                tickets = await prisma.supportTicket.findMany({
                    include: {
                        business: true,
                        user: true
                    },
                    orderBy: { created_at: 'desc' }
                });
            } else {
                // Tenant users see tickets for their business
                tickets = await prisma.supportTicket.findMany({
                    where: { business_id: Number(businessId) },
                    include: {
                        user: true
                    },
                    orderBy: { created_at: 'desc' }
                });
            }

            return res.status(200).json({ data: tickets });
        } catch (error: any) {
            fs.appendFileSync('ticket_api_error.txt', `\n[${new Date().toISOString()}] TICKET API ERROR: Role: ${user.role}, Biz: ${user.business}, Err: ${error.stack || error.message}\n`);
            console.error("[TICKETS_GET_ERROR]", error);
            return res.status(500).json({ message: error.message, stack: error.stack });
        }
    }

    if (req.method === 'POST') {
        try {
            const { subject, description, priority, category } = req.body;

            if (!subject || !description) {
                return res.status(400).json({ message: 'Subject and description are required' });
            }

            const ticket = await prisma.supportTicket.create({
                data: {
                    subject,
                    description,
                    priority: priority || 'medium',
                    category,
                    business_id: user.business,
                    user_id: user.id,
                }
            });

            return res.status(201).json({ message: 'Ticket created successfully', data: ticket });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
