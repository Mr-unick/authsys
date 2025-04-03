import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";

import { ResponseInstance } from "../../utils/instances";
import { Users } from "../../app/entity/Users";
import { UserRepository } from "../../app/reposatory/userRepo";
import { RolesRepository } from "../../app/reposatory/roleRepo";
import { Roles } from "../../app/entity/Roles";
import { Business } from "../../app/entity/Business";
import { Permissions } from "../../app/entity/Permissions";
import { In } from "typeorm";
import { Branch } from "../../app/entity/Branch";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req, res) {

  let user = await VerifyToken(req, res, 'roles');

  const RolesRepo = RolesRepository.onlyPermit(user?.business);

  if (req.method == "GET") {
    try {
      
       const RolesData = await RolesRepo.getMany();
       
      const tablerows = RolesData.map((data) => {
        return {
          id: data.id,
          name: data.name,
        };
      });

      

      const tabledata = new GenerateTable({
        name: "Roles",
        data: tablerows,
      }).policy(user,'roles').addform('roleform').formtype('page').gettable();


      const response: ResponseInstance = {
        message: "Request successful",
        data: tabledata,
        status: 200,
      };

      res.json(response);
    } catch (e) {
      const response: ResponseInstance = {
        message: "Something Went Wrong",
        data: [],
        status: 500,
      };

      res.json(response);
    }
  }

  if (req.method == "POST"){

    const { name , permissions ,branch} = req.body;

    let buisnes = await AppDataSource.getRepository(Business).findOne({where:{id:1}});

    let rolebranch;


    if(!buisnes){
      const response: ResponseInstance = {
        message: "Business not found",
        data: [],
        status: 404,
      };
      res.json(response);
      return;
    }


    let newRole =  new Roles();
    
    let permissionsList = await AppDataSource.getRepository(Permissions).find({
      where:{id:In(permissions)}
    })

  
    newRole.name = name;
    newRole.permissions = permissionsList;
    newRole.created_at = new Date();

    if (branch) {
      rolebranch = await AppDataSource.getRepository(Branch).findOne({ where: { id: branch } })
      newRole.branch = rolebranch;
    }
   
    newRole.buisness= req.body.buisness;


    AppDataSource.getRepository(Roles).save(newRole);

    const response: ResponseInstance = {
      message: "New Role Created Successfully",
      data: newRole,
      status: 200,
    };
    res.json(response);
    
  }
  if (req.method == "DELETE") {
    try {
  
      
      await AppDataSource.getRepository(Roles).createQueryBuilder("role")
        .delete()
        .where("id = :id", { id: req.query.id })
        .execute();

      const response: ResponseInstance = {
        message: "Record Deleted Succesfully",
        data: [],
        status: 200,
      };

      res.json(response);
    } catch (e) {
      const response: ResponseInstance = {
        message: "Something went wrong while deleting record",
        data: [e],
        status: 500,
      };

      res.json(response);
    }
  }
}
