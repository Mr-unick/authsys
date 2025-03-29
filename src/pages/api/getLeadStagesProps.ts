import { haspermission } from "@/utils/authroization";
import { Business } from "../../app/entity/Business";
import { LeadStages } from "../../app/entity/LeadStages";
import { AppDataSource } from "../../app/lib/data-source";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { UsserData } from "../../../const";
import { VerifyToken } from "@/utils/VerifyToken";
import { Any } from "typeorm";




export default async function handler(req, res) {
  let user = await VerifyToken(req, res, 'leadstages');
 if(req.method == "GET"){
   try {

     

     let stages = await AppDataSource.getRepository(LeadStages).createQueryBuilder('stages').limit(10).getMany();

  

     let tabledata = new GenerateTable({
       name: "Lead Stages",
       data: stages,
     }).policy(user,'leadstages').addform('leadstageform').gettable();

     //  console.log(tabledata)


     const response: ResponseInstance = {
       message: "Succes",
       data: tabledata,
       status: 200,
     };

     res.json(response)

   } catch (e) {

     const response: ResponseInstance = {
       message: "Something Went Wrong",
       data: [],
       status: 500,
     };

     res.json(response)
   }
 }

 if(req.method == "POST"){
  try {
    const { stage_name, discription,colour} = req.body;

    let business = await AppDataSource.getRepository(Business).findOne({where:{id:1}});

    const newStage = new LeadStages();
    newStage.stage_name = stage_name;
    newStage.colour = colour;
    newStage.business = user.buisness_id;
    newStage.discription = discription;

    await AppDataSource.getRepository(LeadStages).save(newStage);

    const response: ResponseInstance = {
      message: "Stage Created Successfully",
      data: [],
      status: 200,
    };

    res.json(response); 
  } catch (error) {
    const response: ResponseInstance = {
      message: "Something Went Wrong",
      data: [],
      status: 500,
    };

    res.json(response);

  }
 }
}