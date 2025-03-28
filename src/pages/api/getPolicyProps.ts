import { In } from "typeorm";
import { Permissions } from "../../app/entity/Permissions";
import { Policy } from "../../app/entity/Policy";
import { AppDataSource } from "../../app/lib/data-source";



export default async function handler(req,res){

 if(req.method === "GET"){
let policy = await AppDataSource.getRepository(Policy).find({
    relations:["permissions"]
})

res.json({
    message:"Policy fetched successfully",
    data:policy,
    status:200
})
 }

 if(req.method === "POST"){
    try {
        let newpolicy = new Policy();
        newpolicy.name = "dashboard";
        newpolicy.description = "User can view dashboard";

        newpolicy.permissions = await AppDataSource.getRepository(Permissions).find({
            where:{
                    id:In([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
                }
        })

        let policy = await AppDataSource.getRepository(Policy).save(newpolicy);
        
        res.json({
            message:"Policy created successfully",
            data:policy,
            status:200
        })
        
    } catch (error) {

        console.log(error);
        
        res.json({
            message:"Something went wrong",
            status:500,
            error:error
        })
    }
 }
}
