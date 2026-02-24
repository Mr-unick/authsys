import prisma from "@/app/lib/prisma";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function uploadLeads(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const { leads } = req.body;

        if (!leads || !Array.isArray(leads)) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        const leadsBatch = leads.map((lead: any) => ({
            name: lead.name,
            email: lead.email,
            address: lead?.address,
            business_id: user.business,
            phone: lead?.phone?.toString() || null,
            second_phone: lead?.second_phone?.toString() || null,
            created_at: new Date(),
            updated_at: new Date()
        }));

        await prisma.lead.createMany({
            data: leadsBatch
        });

        const response: ResponseInstance = {
            message: 'Leads uploaded successfully',
            data: [],
            status: 200
        }
        return res.json(response);
    } catch (error: any) {
        console.error("[uploadLeads]", error);
        const response: ResponseInstance = {
            message: 'Leads upload failed',
            data: [error.message],
            status: 500
        }
        return res.status(500).json(response);
    }
}

