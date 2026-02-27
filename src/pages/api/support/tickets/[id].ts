import prisma from "@/app/lib/prisma";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    const { id } = req.query;
    const ticketId = parseInt(id as string);

    if (req.method === 'GET') {
        try {
            const ticket = await prisma.supportTicket.findUnique({
                where: { id: ticketId },
                include: {
                    messages: {
                        orderBy: { created_at: 'asc' }
                    },
                    business: true,
                    user: true
                }
            });

            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            // Check access
            if (user.role !== 'SUPER_ADMIN' && ticket.business_id !== user.business) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            return res.status(200).json({ data: ticket });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'POST') {
        // Post a message
        try {
            const { message } = req.body;
            if (!message) return res.status(400).json({ message: 'Message is required' });

            const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            // Check access
            if (user.role !== 'SUPER_ADMIN' && ticket.business_id !== user.business) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            const newMessage = await prisma.ticketMessage.create({
                data: {
                    ticket_id: ticketId,
                    sender_id: user.id,
                    is_admin: user.role === 'SUPER_ADMIN',
                    message
                }
            });

            // Update ticket updated_at
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { updated_at: new Date() }
            });

            return res.status(201).json({ data: newMessage });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PATCH') {
        // Update ticket status (Admin only or closer)
        try {
            const { status } = req.body;
            if (!status) return res.status(400).json({ message: 'Status is required' });

            const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            if (user.role !== 'SUPER_ADMIN' && status !== 'closed') {
                return res.status(403).json({ message: 'Only admins can change status (except closing)' });
            }

            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: { status }
            });

            return res.status(200).json({ message: 'Status updated' });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
