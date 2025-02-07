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

export default async function handler(req, res) {
    
  const RolesRepo = RolesRepository.onlyPermit(1);

  if (req.method == "GET") {
    try {
      const BuisnesData = await RolesRepo.getMany();

      console.log(BuisnesData);

      const tablerows = BuisnesData.map((data) => {
        return {
          id: data.id,
          name: data.name,
        };
      });

      const tabledata = new GenerateTable({
        name: "Roles",
        data: tablerows,
        form:{
          url
        }
      });

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

    const { name , permissions ,branch , buisnesId} = req.body;

    let buisnes = await AppDataSource.getRepository(Business).findOne({where:{id:1}});

    let newRole =  new Roles();
    
    let permissionsList = await AppDataSource.getRepository(Permissions).find({
      where:{id:In(permissions)}
    })

  
    newRole.name = "Admin";
    newRole.permissions = permissionsList;
    newRole.buisness=buisnes;
    newRole.created_at = new Date();


    AppDataSource.getRepository(Roles).save(newRole);

    res.json(newRole)
    

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
