import { Leads } from "@/app/entity/index"
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";
import { Users } from "@/app/entity/index";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function assignLeads(req, res) {
    try {
        let user = await VerifyToken(req, res, null);
        const { leads, salespersons } = req.body;

        if (!leads || !salespersons || !Array.isArray(leads) || !Array.isArray(salespersons)) {
            const response: ResponseInstance = {
                message: "Invalid request body",
                data: [],
                status: 400
            }
            return res.status(400).json(response);
        }

        // Process each lead
        for (const leadId of leads) {
            const lead = await AppDataSource.getRepository(Leads).findOne({
                where: { id: leadId },
                relations: ['users']
            });

            if (!lead) {
                const response: ResponseInstance = {
                    message: `Lead with ID ${leadId} not found`,
                    data: [],
                    status: 404
                }
                return res.status(404).json(response);
            }

            // Create stage history for initial assignment
            const initialHistory = new StageChangeHistory();
            initialHistory.stage = lead.stage || 1;
            initialHistory.lead = leadId;
            initialHistory.changed_by = user.id;
            initialHistory.changed_at = new Date();
            initialHistory.reason = 'Initial Assignment';
            await AppDataSource.getRepository(StageChangeHistory).save(initialHistory);

            // Get existing user IDs
            const existingUserIds = lead.users?.map(user => user.id) || [];

            // Find new users to add
            const newUserIds = salespersons.filter(id => !existingUserIds.includes(id));

            if (newUserIds.length === 0) {
                const response: ResponseInstance = {
                    message: "Users already assigned to lead",
                    data: [],
                    status: 200
                }
                return res.json(response);
            }

            // Get new users and add them to the lead
            const newUsers = await AppDataSource.getRepository(Users).findByIds(newUserIds);
            lead.users = [...(lead.users || []), ...newUsers];
            await AppDataSource.getRepository(Leads).save(lead);
        }

        const response: ResponseInstance = {
            message: "Leads assigned successfully",
            data: [],
            status: 200
        }
        res.json(response);
    } catch (error) {
        console.log(error);
        const response: ResponseInstance = {
            message: "Something went wrong",
            data: [],
            status: 500
        }
        res.json(response);
    }
}

