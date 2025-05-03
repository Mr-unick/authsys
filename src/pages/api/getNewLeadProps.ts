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

    let user = await VerifyToken(req, res, 'freshleads');

    if (req.method == "GET") {
        const leadRepository = AppDataSource.getRepository(Leads);
        let lead;

        let count = await leadRepository.find({
            where:{
                business:user.business
            }
        });

        lead = await leadRepository.createQueryBuilder('leads')
            .leftJoin('leads.users', 'users')
            .leftJoin('leads.history', 'history')
            .leftJoin('history.changed_by', 'changed_by')
            .leftJoin('leads.stage', 'stage')
            .leftJoin('leads.business', 'business')
            .where('business.id = :businessid', { businessid: user.business })
            .andWhere(qb => {
                const subQuery = qb.subQuery()
                    .select("lu.lead_id")
                    .from("lead_users", "lu")
                    .where("lu.lead_id = leads.id")
                    .getQuery();
                return `NOT EXISTS (${subQuery})`;
            })
            .limit(10)
            .getMany();



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
                status: true || '-',
                collborators: collaborators || '-',
                headcollborator: data.headcollborator || 'Nikhil Lende',
                nextfollowup: data?.nextfollowup || '-',
                lead_source: data?.source || '-',
                note: data?.note || '-'

            }

        })

        const tabledata = new GenerateTable({
            name: "Leads",
            data: leads,
        }).policy(user, 'freshleads').addform('leadform').gettable();

        const response = {
            message: "Request successful",
            data: tabledata,
            status: 200,
            count:count.length
        };

        res.json(response)
    }
}



