import { Users } from "lucide-react";
import { AppDataSource } from "../../../app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { UserRepository } from "../../../app/reposatory/userRepo";
import { LeadStages } from "@/app/entity/LeadStages";
import { ResponseInstance } from "@/utils/instances";


export default async function handler(req, res) {

    if (req.query.id != "undefined") {

       

        const stage = await AppDataSource.getRepository(LeadStages).findOne({
            where:{
                id: req.query.id
            },select:['stage_name','colour','discription']
        });

        if(!stage){

            const response: ResponseInstance = {
                message: "Stage not found",
                data: [],
                status: 404,
            };

            return res.json(response);
        }


        const form = new GenerateForm('Edit Lead Stage');

        form.addField('stage_name', 'text').value(stage.stage_name).required();
        form.addField('colour', 'color').value(stage.colour);
        form.addField('discription', 'textarea').newRow().value(stage.discription);
        form.submiturl('getLeadStagesProps');
        form.method('put');
        res.json(form.getForm());

    } else {
        const form = new GenerateForm('Create Lead Stage');
        
        form.addField('stage_name', 'text').required();
        form.addField('colour', 'color').required();
        form.addField('discription', 'textarea').required().newRow();
        form.submiturl('getLeadStagesProps');
        form.method('post');
        res.json(form.getForm());

    }



}