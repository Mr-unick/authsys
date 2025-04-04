import { Leads } from "@/app/entity/Leads";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function assignLeads(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let user = await VerifyToken(req, res, null);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { leads, salespersons } = req.body;

        if (!leads || !salespersons || !Array.isArray(leads) || !Array.isArray(salespersons)) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        // Process each lead sequentially
        for (const leadId of leads) {
            const lead = await AppDataSource.getRepository(Leads).findOne({
                where: { id: leadId }
            });

            if (!lead) {
                return res.status(404).json({ message: `Lead with ID ${leadId} not found` });
            }

            // Process each salesperson sequentially
            for (const userId of salespersons) {
                const user = await AppDataSource.getRepository(Users).findOne({
                    where: { id: userId }
                });

                if (!user) {
                    return res.status(404).json({ message: `User with ID ${userId} not found` });
                }

                if (!lead.users) {
                    lead.users = [];
                }

                // Check if user is already assigned to this lead
                if (!lead.users.some(u => u.id === user.id)) {
                    lead.users.push(user);
                }
            }

            await AppDataSource.getRepository(Leads).save(lead);
        }

        const response : ResponseInstance ={
            message : 'Leads assigned successfully',
            data : [],
            status : 200
        }
        return res.json(response);
    } catch (error) {
        const response: ResponseInstance = {
            message: 'Leads assigned failed',
            data: [],
            status: 500
        }
        return res.json(response);
    }
}

