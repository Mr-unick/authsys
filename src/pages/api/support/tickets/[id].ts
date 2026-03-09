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
                    internalNotes: user.role === 'SUPER_ADMIN' ? {
                        orderBy: { created_at: 'desc' }
                    } : false,
                    activities: {
                        orderBy: { created_at: 'desc' }
                    },
                    business: true,
                    user: true,
                    assignee: true
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
        // Post a message (or internal note)
        try {
            const { message, isInternal } = req.body;
            if (!message) return res.status(400).json({ message: 'Message is required' });

            const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            // Check access
            if (user.role !== 'SUPER_ADMIN' && ticket.business_id !== user.business) {
                return res.status(403).json({ message: 'Forbidden' });
            }

            if (isInternal) {
                if (user.role !== 'SUPER_ADMIN') return res.status(403).json({ message: 'Only staff can post internal notes' });

                const note = await prisma.ticketInternalNote.create({
                    data: {
                        ticket_id: ticketId,
                        admin_id: user.id,
                        note: message
                    }
                });

                // Log activity
                await prisma.ticketActivity.create({
                    data: {
                        ticket_id: ticketId,
                        actor_id: user.id,
                        actor_name: user.name,
                        is_admin: true,
                        type: 'note_added',
                        description: 'Added an internal note'
                    }
                });

                return res.status(201).json({ data: note });
            }

            const isStaffMsg = user.role === 'SUPER_ADMIN';
            const newMessage = await prisma.ticketMessage.create({
                data: {
                    ticket_id: ticketId,
                    sender_id: user.id,
                    is_admin: isStaffMsg,
                    message
                }
            });

            // Update ticket
            await prisma.supportTicket.update({
                where: { id: ticketId },
                data: {
                    updated_at: new Date(),
                    last_responded_at: new Date(),
                    status: isStaffMsg ? 'waiting-user' : 'open'
                }
            });

            // Log activity only for the first message or if status changes
            // Actually, message is fine as is.

            return res.status(201).json({ data: newMessage });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'PATCH') {
        // Update ticket status or assignment
        try {
            const { status, assigned_to_id, priority } = req.body;

            const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
            if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

            if (user.role !== 'SUPER_ADMIN' && (status !== 'closed' && !status)) {
                return res.status(403).json({ message: 'Only admins can perform these updates' });
            }

            const updateData: any = {};
            if (status) updateData.status = status;
            if (assigned_to_id !== undefined) updateData.assigned_to_id = assigned_to_id;
            if (priority) updateData.priority = priority;

            const updatedTicket = await prisma.supportTicket.update({
                where: { id: ticketId },
                data: updateData
            });

            // Log activities
            if (status && status !== ticket.status) {
                await prisma.ticketActivity.create({
                    data: {
                        ticket_id: ticketId,
                        actor_id: user.id,
                        actor_name: user.name,
                        is_admin: user.role === 'SUPER_ADMIN',
                        type: 'status_change',
                        description: `Changed status from ${ticket.status} to ${status}`
                    }
                });
            }

            if (assigned_to_id !== undefined && assigned_to_id !== ticket.assigned_to_id) {
                const assigneeName = assigned_to_id ? (await prisma.superAdmin.findUnique({ where: { id: assigned_to_id } }))?.name || 'Someone' : 'Unassigned';
                await prisma.ticketActivity.create({
                    data: {
                        ticket_id: ticketId,
                        actor_id: user.id,
                        actor_name: user.name,
                        is_admin: true,
                        type: 'assignment',
                        description: `Assigned ticket to ${assigneeName}`
                    }
                });
            }

            return res.status(200).json({ message: 'Ticket updated', data: updatedTicket });
        } catch (error: any) {
            return res.status(500).json({ message: error.message });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
