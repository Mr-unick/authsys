import { Comment } from "@/app/entity/Comment";
import { Leads } from "@/app/entity/Leads";
import { LeadStages } from "@/app/entity/LeadStages";
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { haspermission } from "@/utils/authroization";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import { color } from "motion/dist/react";




export const getleadDetails = async(user,id)=>{
    try {
        const leadid = id;
       
        const lead = await AppDataSource.getRepository(Leads)
            .createQueryBuilder('leads')
            .leftJoinAndSelect('leads.users', 'users')
            .leftJoinAndSelect('leads.stage', 'stage')
            .leftJoinAndSelect('leads.history', 'history')
            .leftJoinAndSelect('leads.comments', 'comments')
            .leftJoinAndSelect('comments.user', 'user')
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

       //     console.log(leadid,lead)

            if (!lead) {
                const response: ResponseInstance = {
                    status: 404,
                    message: "Lead not found",
                    data: []
                }
                return response;
            }

        const stage = (await AppDataSource.getRepository(Leads)
            .createQueryBuilder('leads')
            .leftJoinAndSelect('leads.stage', 'stage')
            .where('leads.id = :id', { id: leadid })
            .getRawOne())?.stage_stage_name;


        // let history = lead?.history?.map((item) => {
        //     // let stage = item.history_stage.stage_name;
        //     return {
        //         stage: item.stage,
        //         changedAt: item.changed_at,
        //         changedBy: item.changed_by,
        //         reason: item.reason,
        //     }
        // })

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
             comments: lead?.comments,
            addcollborator: haspermission(user, 'assign_collborators'),
            deletecollborator: haspermission(user, 'delete_collborators'),
            viewcollborator: haspermission(user, 'view_collborators'),
            addcomment: haspermission(user, 'add_comment'),
            deletecomment: haspermission(user, 'delete_comment'),
            editcomment: haspermission(user, 'edit_comment'),
            viewcomment: haspermission(user, 'view_comment'),
            changestage: haspermission(user, 'add_stage'),
            deletestage: haspermission(user, 'delete_stage'),
            editstage: haspermission(user, 'edit_stage'),
            viewstage: haspermission(user, 'view_stage'),
        }


        const response: ResponseInstance = {
            status: 200,
            message: "Lead found",
            data: leaddetails
        }

        return response;

    } catch (error) {
        return {
            message: "Internal server error",
            data: error.message
        }
    }
}

export default async function handler(req, res) {

    const user = await VerifyToken(req, res, 'leaddetails');
    const leadid = req.query.id;
  
    let response = await getleadDetails(user,leadid);
    

    res.json(response);
 
}
