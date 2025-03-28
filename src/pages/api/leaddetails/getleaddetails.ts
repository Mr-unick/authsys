import { Comment } from "@/app/entity/Comment";
import { Leads } from "@/app/entity/Leads";
import { LeadStages } from "@/app/entity/LeadStages";
import { StageChangeHistory } from "@/app/entity/StageChangeHistory";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";






export default async function handler(req, res) {
    try {
     const leadid = req.query.id;
        console.log(leadid,'from getleaddetails')

     const lead = await AppDataSource.getRepository(Leads).findOne({
        where: {
             id: leadid
        },relations:['history','history.stage','history.changed_by','comments','comments.user']
     })

   let newhistory = new StageChangeHistory;
        newhistory.stage = await AppDataSource.getRepository(LeadStages).findOne({
        where: {
            id: 3
        }
     });

     newhistory.reason = "New Lead";
     newhistory.lead = lead?.id;
     

     
    newhistory.changed_at = new Date();
     newhistory.updated_at = new Date();
        newhistory.changed_by = await AppDataSource.getRepository(Users).findOne({
            where: {
                id: 1
            }
        });

    let newComment = new Comment;
    newComment.comment = "Nothing to say";
    newComment.lead = lead?.id;
    newComment.created_at = new Date();
    newComment.user = await AppDataSource.getRepository(Users).findOne({
        where: {
            id: 1
        }
    });
    
    // await AppDataSource.getRepository(Comment).save(newComment);

    //  await AppDataSource.getRepository(StageChangeHistory).save(newhistory);

     let history = lead?.history.map((item) => {
         return {
             stage: item.stage.stage_name,
             changedAt: item.changed_at,
             changedBy:item.changed_by.name,
             reason: item.reason,
             colour: item.stage.colour  // Colour from Stages array
         }
     })




     let leaddetails = {
        id: lead?.id,
        name: lead?.name,
        email: lead?.email,
        phone: lead?.phone,
        secondPhone: lead?.secondNumber || "No second phone",
        address: lead?.address,
        city: lead?.city || "Mumbai",
        state: lead?.state || "Maharashtra",
        country: lead?.country || "India",
        pincode: lead?.zip || "411001",
        leadStatus: lead?.status || "active",
         leadSource: lead?.source || "Website",
         leadStage: lead?.history[lead?.history.length - 1].stage.stage_name,
        notes: lead?.notes || "No notes",
        collaborators: lead?.collaborators || [],
         stageChangeHistory: history,
         comments: lead?.comments?.map((item) => {
            return {
                comment: item.comment,
                user: item.user.name,
                createdAt: item.created_at
            }
         })
     }

     if (!lead) {
        const response : ResponseInstance = {
            status: 404,
            message: "Lead not found",
            data: [id]
        }
        return res.json(response);
     }

     const response : ResponseInstance = {
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
