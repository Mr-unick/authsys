import { Users } from "lucide-react";
import { AppDataSource } from "../../../app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { UserRepository } from "../../../app/reposatory/userRepo";


export default async function handler(req, res){

    if( req.query.id != "undefined"){

        // we are not recinving any id means the request is create
      
        const UsersRepo =  await UserRepository.onlyPermit(1);

        const user = await UsersRepo.where("users.id = :id", { id: req.query.id }).getOne(); 
        
        const form = new GenerateForm('User Form');

        form.addField('name','text').value(user?.name).required();
        form.addField('email','email').value(user?.email);
        form.addField('number','text').value('7448080267').newRow();
        form.addField('address','text').value('yavatmal, ghtanji dist');
        form.addField('gender','select').value('male').options(['male','female','other']).newRow();
        form.addField('last name','text').value('lende');
     
    
        res.json(form.getForm());
 
    }else{


    // we are not recinving any id means the request is Update

    const form = new GenerateForm('User Form');


    form.addField('name','text').required();
    form.addField('email','email');
    form.addField('number','text').newRow();
    form.addField('address','text');
    form.addField('gender','select').options(['male','female','other']).newRow();
    form.addField('last name','text');

    res.json(form.getForm());

   }



}