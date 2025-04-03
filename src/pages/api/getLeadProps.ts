import { getRepository } from "typeorm";
import { Users } from "../../app/entity/Users";
import { Business } from "../../app/entity/Business";
import { Leads } from "../../app/entity/Leads";
import { AppDataSource } from "../../app/lib/data-source";
import { StageChangeHistory } from "../../app/entity/StageChangeHistory";
import { LeadStages } from "../../app/entity/LeadStages";
import { LeadsTableInstace, ResponseInstance } from "../../utils/instances";
import { GenerateTable } from "../../utils/generateTable";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req, res) {
  let user = await VerifyToken(req, res,'leads');
  if (req.method == "POST") {

    const userRepository = AppDataSource.getRepository(Users);
    const businessRepository = AppDataSource.getRepository(Business);
    const leadRepository = AppDataSource.getRepository(Leads);
    const StageChangeHistoryRepository =
      AppDataSource.getRepository(StageChangeHistory);
    const stageRepository = AppDataSource.getRepository(LeadStages);

    const user = await userRepository.findOne({ where: { id: 1 } });
    if (!user) {
      throw new Error("User not found");
    }

    const business = await businessRepository.findOne({ where: { id: 1 } });
    if (!business) {
      throw new Error("Business not found");
    }
    const stage = await stageRepository.findOne({ where: { id: 1 } });
    if (!stage) {
      throw new Error("Stage not found");
    }

    const newLead = new Leads();

    newLead.name = req.body.name;
    newLead.email = req.body.email;
    newLead.phone =  req.body.phone;
    newLead.lead_source = 'website';
    newLead.created_at = new Date();
    newLead.updated_at = new Date();
    newLead.users = [user];
    newLead.stage = req.body.stage;
    newLead.business = req.body.business;

    await leadRepository.save(newLead);



    const newStageChangeHistory = new StageChangeHistory();

    newStageChangeHistory.changed_at = new Date();
    newStageChangeHistory.lead =req.body.user;
    newStageChangeHistory.stage = newLead.stage;
    newStageChangeHistory.reason = "Nothing Special";
    newStageChangeHistory.changed_by = req.body.user;

    await StageChangeHistoryRepository.save(newStageChangeHistory);

    console.log(
      "Lead created and associated with user and business successfully"
    );

    res.json({ newLead });
  }

  if (req.method == "GET") {
    const leadRepository = AppDataSource.getRepository(Leads);
    let lead;

      lead = await leadRepository.createQueryBuilder('leads')
      .leftJoin('leads.users', 'users')
      .leftJoin('leads.history', 'history')
      .leftJoin('history.changed_by', 'changed_by')
      .leftJoin('leads.stage', 'stage')
      .where(qb => {
          const subQuery = qb.subQuery()
            .select("1")
            .from("lead_users", "lu")
            .where("lu.lead_id = leads.id")
            .getQuery();
          return `EXISTS (${subQuery})`;
        })
      .getMany();
   

        
          let leads  = lead.map((data)=>{

            let collaborators = data?.users?.map((collborator) => {
              return collborator.name;
            });
      
            let history = data?.history?.map((history) => {
              return {
                stage: history.stage.stage_name,
                changed_by: history.changed_by.name,
                comment: history.reason,
              };
            });

            return {
              id : data.id,
              name : data?.name || '-',
              email:data?.email || '-',
              address:data?.address || '-',
              phone:data?.phone || '-',
              second_phone:data?.second_phone || '-',
              status:true || '-',
              collborators:collaborators || '-',
              headcollborator:data.headcollborator || 'Nikhil Lende',
              nextfollowup:data?.nextfollowup || '-',
              lead_source:data?.source || '-',
              note:data?.note || '-'

            }

          }) 

            const tabledata = new GenerateTable({
              name: "Leads",
              data: leads,
            }).policy(user,'leads').addform('leadform').gettable();
      
            const response: ResponseInstance = {
              message: "Request successful",
              data: tabledata,
              status: 200,
            };

            res.json(response)
    }
  }

 

