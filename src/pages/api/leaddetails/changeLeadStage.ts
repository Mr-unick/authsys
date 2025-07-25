import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

// import { Leads } from "@/app/entity/Leads";
// import { StageChangeHistory } from "@/app/entity/StageChangeHistory";





export default async function changeLeadStage(req, res) {

  const { Leads } = await import("@/app/entity/Leads");
  const { StageChangeHistory } = await import("@/app/entity/StageChangeHistory");
  
    try {
        let user = await VerifyToken(req, res, 'stage');

        const {  stage, reason } = req.body;
        const leadId  = req.query.id;

        const lead = await AppDataSource.getRepository(Leads).findOne({
            where: { id: leadId }
        });

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }
       

        let newhistory = new StageChangeHistory;
        newhistory.stage = stage;
        newhistory.lead = leadId;
        newhistory.changed_by = user.id;
        newhistory.changed_at = new Date();
        newhistory.reason = reason;

        await AppDataSource.getRepository(StageChangeHistory).save(newhistory);

        if (!stage) {
            return res.status(404).json({ message: "Stage not found" });
        }

        const response: ResponseInstance = {
            message: "Stage changed",
            data: [],
            status: 200
        }

        res.json(response);
    } catch (error) {
      
        const response : ResponseInstance = {
            message: "Something went wrong",
            data: [error.message],
            status: 500
        }

        res.json(response);
    }
}
