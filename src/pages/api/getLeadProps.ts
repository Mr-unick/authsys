import { getRepository } from "typeorm";
import { Users } from "../../app/entity/Users";
import { Business } from "../../app/entity/Business";
import { Leads } from "../../app/entity/Leads";
import { AppDataSource } from "../../app/lib/data-source";
import { StageChangeHistory } from "../../app/entity/StageChangeHistory";
import { LeadStages } from "../../app/entity/LeadStages";
import { LeadsTableInstace, ResponseInstance } from "../../utils/instances";
import { GenerateTable } from "../../utils/generateTable";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const leadData = {
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "123-456-7890",
      lead_source: "Website",
    };

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

    newLead.name = leaddata?.name;
    newLead.email = leaddata?.email;
    newLead.phone = leaddata?.phone;
    newLead.lead_source = leaddata?.lead_source;
    newLead.created_at = new Date();
    newLead.updated_at = new Date();
    newLead.users = [user];
    newLead.stage = stage;
    newLead.business = business;

    await leadRepository.save(newLead);

    const newStageChangeHistory = new StageChangeHistory();

    newStageChangeHistory.changed_at = new Date();
    newStageChangeHistory.lead = newLead;
    newStageChangeHistory.stage = newLead.stage;
    newStageChangeHistory.reason = "Nothing Special";
    newStageChangeHistory.changed_by = user;

    await StageChangeHistoryRepository.save(newStageChangeHistory);

    console.log(
      "Lead created and associated with user and business successfully"
    );

    res.json({ newLead });
  }

  if (req.method == "GET") {
    const leadRepository = AppDataSource.getRepository(Leads);
    let lead;

    if (req.query.id) {
      lead = await leadRepository.find({
        where: { id: req.query.id },
        relations: [
          "users",
          "history.changed_by",
          "history.lead",
          "history.stage",
          "stage",
        ],
      });
    } else {
      lead = await leadRepository.find({
        relations: [
          "users",
          "history.changed_by",
          "history.lead",
          "history.stage",
          "stage",
        ],
      });
    }

    if (req.query.id) {
      res.json(lead[0]);
    } else {

      console.log(lead);
        
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
            });
      
            const response: ResponseInstance = {
              message: "Request successful",
              data: tabledata,
              status: 200,
            };

            res.json(response)
    }
  }

  //   if (req.method === 'PUT') {
  //     const { leadId, userIds } = req.body;

  //     const leadRepository = AppDataSource.getRepository(Leads);
  //     const userRepository = AppDataSource.getRepository(Users);

  //     const lead = await leadRepository.findOne({
  //       where: { id: leadId },
  //       relations: ['users'],
  //     });

  //     if (!lead) {
  //       return res.status(404).json({ message: 'Lead not found' });
  //     }

  //     const usersToAdd = await userRepository.findByIds(userIds);

  //     lead.users = [...lead.users, ...usersToAdd];
  //     await leadRepository.save(lead);

  //     res.json(lead);
  //   }
}
