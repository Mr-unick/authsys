import { Comment } from "@/app/entity/Comment";
import { Leads } from "@/app/entity/Leads";
import { LeadStages } from "@/app/entity/LeadStages";
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { color } from "motion/dist/react";






export default async function handler(req, res) {
    try {
        const leadid = req.query.id;
        console.log(leadid, 'from getleaddetails')

        const lead = await AppDataSource.getRepository(Leads)
            .createQueryBuilder('leads')
            .leftJoinAndSelect('leads.users', 'users')
            .leftJoinAndSelect('leads.stage', 'stage')
            .leftJoinAndSelect('leads.history', 'history')
            .leftJoinAndSelect('history.changed_by', 'changed_by')
            .leftJoin('history.stage', 'history_stage')  
            .addSelect('history_stage.stage_name')
            .addSelect('history_stage.colour')
            .leftJoin('leads.business', 'business')
            .where('leads.id = :id', { id: leadid })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select("1")
                    .from("lead_users", "lu")
                    .where("lu.lead_id = leads.id")
                    .getQuery();
                return `EXISTS (${subQuery})`;
            })
            .getOne();


        const stage = (await AppDataSource.getRepository(Leads)
            .createQueryBuilder('leads')
            .leftJoinAndSelect('leads.stage', 'stage')
            .where('leads.id = :id', { id: leadid })
            .getRawOne()).stage_stage_name;

     
     let   history = lead?.history.map((item) => {
        // let stage = item.history_stage.stage_name;
            return {
                stage: item.stage,
                changedAt: item.changed_at,
                changedBy: item.changed_by,
                reason: item.reason,
            }
        })





        let leaddetails = {
            id: lead?.id,
            name: lead?.name,
            email: lead?.email,
            phone: lead?.phone,
            secondPhone: lead?.second_phone || "No second phone",
            address: lead?.address,
            city: lead?.city || "Mumbai",
            state: lead?.state || "Maharashtra",
            country: lead?.country || "India",
            pincode: lead?.pincode || "411001",
            leadStatus: lead?.status || "active",
            leadSource: lead?.lead_source || "Website",
            leadStage: stage,
            notes: lead?.notes || "No notes",
            collaborators: lead?.users || [],
            stageChangeHistory: history || [],
            //  comments: lead?.comments?.map((item) => {
            //     return {
            //         comment: item.comment,
            //         user: item.user.name,
            //         createdAt: item.created_at
            //     }
            //  })
        }

        if (!lead) {
            const response: ResponseInstance = {
                status: 404,
                message: "Lead not found",
                data: []
            }
            return res.json(response);
        }

        const response: ResponseInstance = {
            status: 200,
            message: "Lead found",
            data: leaddetails
        }

        return res.json(response);


    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            data: error.message
        })
    }
}
