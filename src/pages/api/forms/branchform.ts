import { Users } from "lucide-react";
import { AppDataSource } from "../../../app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { UserRepository } from "../../../app/reposatory/userRepo";
import { Branch } from "@/app/entity/Branch";


export default async function handler(req, res){

    if( req.query.id != "undefined"){

       

        const branch = await AppDataSource.getRepository(Branch).findOneBy({id: req.query.id}); 
        
        const form = new GenerateForm('Edit Branch');

        if(!branch){
            return res.status(404).json({message: 'Branch not found'});
        }

        form.addField('name', 'text').value(branch?.name).required();
        form.addField('email', 'email').value(branch?.email).required();
        form.addField('branch_code', 'text').value(branch?.branch_code).required();
        form.addField('number', 'text').value(branch?.number).required();
        form.addField('address', 'text').value(branch?.address).required();
        form.addField('state', 'text').value(branch?.state).required();
        form.addField('district', 'text').value(branch?.district).required();
        form.addField('city', 'text').value(branch?.city).required();
        form.addField('pincode', 'text').value(branch?.pincode).required();
        form.addField('discription', 'textarea').value(branch?.discription);

        form.submiturl('getBranchProps');
        form.method('put');
     
    
        res.json(form.getForm());
 
    }else{


    // we are not recinving any id means the request is Update

    const form = new GenerateForm('Add New Branch');

        form.addField('name','text').required();
        form.addField('email', 'email').required();
        form.addField('branch_code', 'text').required();
        form.addField('number', 'text').required();
        form.addField('address', 'text').required();
        form.addField('state', 'text').required();
        form.addField('district', 'text').required();
        form.addField('city', 'text').required();
        form.addField('pincode', 'text').required();
        form.addField('discription', 'textarea');

        form.submiturl('getBranchProps');
        form.method('post');

    res.json(form.getForm());

   }



}