import { Users } from "lucide-react";
import { AppDataSource } from "../../../app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { UserRepository } from "../../../app/reposatory/userRepo";
import { Roles } from "../../../app/entity/Roles";
import { VerifyToken } from "@/utils/VerifyToken";


export default async function handler(req, res) {

    let user = await VerifyToken(req,res,null);

    if(!user){
        return res.status(401).json({
            message: 'Unauthorized',
            status: 401
        });
    }

    let roles = await AppDataSource.getRepository(Roles).createQueryBuilder('roles').where('roles.buisnesId = :businessId', { businessId: user?.business }).getMany();
    let roleOptions = roles.map(role => ({ id: role.id, name: role.name }));


    if (req.query.id != "undefined") {

        // we are not recinving any id means the request is create

        const UsersRepo = await UserRepository.onlyPermit(1);

        const user = await UsersRepo.where("user.id = :id", { id: req.query.id }).getOne();

        const form = new GenerateForm('User Form');

        form.addField('name', 'text').value(user?.name).required();
        form.addField('email', 'email').value(user?.email);
        form.addField('number', 'text').value(user?.number).newRow();
        form.addField('address', 'textarea').newRow().value(user?.address);
        form.addField('gender', 'select').value(user?.gender).options([{
            id: 'male',
            name: 'Male'
        },{
            id: 'female',
            name: 'Female'
        },{
            id: 'other',
            name: 'Other'
        }]);
        form.addField('role', 'select').options(roleOptions).value(user?.role?.id).required();
        form.addField('old_password', 'password').value('yavatmal, ghtanji dist');
        form.addField('new_password', 'password').value('yavatmal, ghtanji dist');
       
        res.json(form.getForm());


    } else {


        const form = new GenerateForm('Create User');

       

        form.addField('name', 'text').required();
        form.addField('email', 'email').required();
      
       
        form.addField('address', 'textarea').newRow().value('yavatmal, ghtanji dist').required();

        form.addField('gender', 'select').value('male').options([{
            id: 'male',
            name: 'Male'
        }, {
            id: 'female',
            name: 'Female'
        }, {
            id: 'other',
            name: 'Other'
        }]);
        form.addField('role', 'select').options(roleOptions).required();

        form.addField('password', 'password').required();
        form.addField('confirm_password', 'password').required();
        
        form.submiturl('getUserProps');
        form.method('post');

        res.json(form.getForm());

    }



}