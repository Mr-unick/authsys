import { Leads } from "@/app/entity/Leads";
import { GenerateForm } from "../../../utils/generateForm";
import { AppDataSource } from "@/app/lib/data-source";


export default async function handler(req, res){

    const {id} = req.query;

    const form = new GenerateForm('Lead Form');

    if(id !== undefined){
        const lead = await AppDataSource.getRepository(Leads).findOne({where: {id: id}});
        form.addField('name', 'text').required().value(lead?.name || '').disabled();
        form.addField('email', 'text').value(lead?.email || '').disabled();
        form.addField('phone', 'text').value(lead?.phone || '').disabled();
        form.addField('second_phone', 'text').value(lead?.second_phone || '');
        form.addField('address', 'textarea').newRow().value(lead?.address || '');
        form.submiturl('getLeadProps');
        form.method('put');
    }else{
        form.addField('name', 'text').required();
        form.addField('email', 'text');
        form.addField('phone', 'text');
        form.addField('second_phone', 'text');
        form.addField('address', 'textarea');
        form.submiturl('getLeadProps');
        form.method('post');
    }


    res.json(form.getForm());

}