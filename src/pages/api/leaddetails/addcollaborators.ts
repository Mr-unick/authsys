import { Leads } from "@/app/entity/Leads";
import { Comment } from "@/app/entity/Comment";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import { Users } from "@/app/entity/Users";




export default async function addCollaborators(req, res) {
    try {
        let user = await VerifyToken(req, res, null);
        const { leads, salespersons } = req.body;

        const leadId =leads[0];

        const lead = await AppDataSource.getRepository(Leads).findOne({
            where: { id: leadId },
            relations: ['users'] ,
            
        });

       

        if (!lead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        const existingUserIds = lead?.users.map(user => user.id);

        const newUserIds = salespersons.filter(id => !existingUserIds.includes(id));

        if (newUserIds.length === 0) {

            const response: ResponseInstance = {
                message: "users already exists",
                data: [],
                status: 200
            }

            res.json(response);
        }

       
        const users = await AppDataSource.getRepository(Users).findByIds(salespersons);
        lead.users = [...lead.users, ...users];
       await AppDataSource.getRepository(Leads).save(lead);
        
        const response: ResponseInstance = {
            message: "Stage changed",
            data: [],
            status: 200
        }

        res.json(response);
    } catch (error) {
        console.log(error);
        const response: ResponseInstance = {
            message: "Something went wrong",
            data: [],
            status: 500
        }

        res.json(response);
    }
}
