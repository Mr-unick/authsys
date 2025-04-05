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
    let user = await VerifyToken(req, res, 'leads');

    if (req.method == "GET") {
        const leadRepository = AppDataSource.getRepository(Leads);
        let lead;

        lead = await leadRepository.createQueryBuilder('leads')
            .leftJoinAndSelect('leads.users', 'users')
            .leftJoin('leads.history', 'history')
            .leftJoin('history.changed_by', 'changed_by')
            .leftJoinAndSelect('leads.stage', 'stage')
            .leftJoin('leads.business', 'business')
            .where('business.id = :businessid', { businessid: user.business })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select("1")
                    .from("lead_users", "lu")
                    .where("lu.lead_id = leads.id")
                    .andWhere("lu.user_id = :userId", { userId: user.id })
                    .getQuery();
                return `EXISTS (${subQuery})`;
            })
            .getMany();

            console.log(lead, '--------------------------------');

        let leads = lead.map((data) => {

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
                id: data.id,
                name: data?.name || '-',
                email: data?.email || '-',
                address: data?.address || '-',
                phone: data?.phone || '-',
                second_phone: data?.second_phone || '-',
                status: data?.status ,
                stage: data?.stage.stage_name,
                collborators: collaborators || '-',
                headcollborator: data.headcollborator || 'Nikhil Lende',
                nextfollowup: data?.nextfollowup || '-',
                lead_source: data?.lead_source || '-',
                note: data?.notes || '-'

            }

        })

        let stages = (await AppDataSource.getRepository(LeadStages)
            .createQueryBuilder('stage')
            .select('stage.stage_name', 'stage_name')
            .addSelect('stage.colour', 'colour')
            .leftJoin('stage.business', 'business')
            .where('business.id = :businessid', { businessid: user.business })
            .getRawMany()).map(q => q);


        
        let data = {
            stages: stages,
            leads: leads
        }

        

        const response: ResponseInstance = {
            message: "Request successful",
            data: data,
            status: 200,
        };

        res.json(response)
    }
}



