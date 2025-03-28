import { AppDataSource } from "@/app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { LeadStages } from "@/app/entity/LeadStages";


export default async function handler(req, res) {

    const form = new GenerateForm('Change Lead Stage');

    let stages = await AppDataSource.getRepository(LeadStages).find();

    let options = stages.map(stage => ({ id: stage.id, name: stage.stage_name }));

   
    form.addField('stage', 'select').newRow().options(options);
    form.addField('reason', 'textarea').newRow().required();
    form.submiturl('leaddetails/changeLeadStage');
    form.method('put');

    res.json(form.getForm());

}