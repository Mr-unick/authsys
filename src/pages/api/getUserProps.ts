
import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";

import { ResponseInstance } from "../../utils/instances";
import { Users } from "../../app/entity/Users";
import { UserRepository } from "../../app/reposatory/userRepo";
import { Roles } from "../../app/entity/Roles";
import { Business } from "@/app/entity/Business";
import { haspermission } from "@/utils/authroization";
import { User } from "lucide-react";
import { userData, UsserData } from "../../../const";
import { VerifyToken } from "@/utils/VerifyToken";





export default async function handler(req, res) {

  let user = await VerifyToken(req, res,'users');

  const UsersRepo = UserRepository.onlyPermit(1);

  if (req.method == "GET") {

    try {

    
      const UsersData = await AppDataSource.getRepository(Users).find({
        relations: [
          "role", 'business', "role.permissions"
        ]
      });

      const roles = await AppDataSource.getRepository(Roles).find();

      // if (roles.length == 0) {
      //   return res.json({
      //     message: "Add Roles First",
      //     type: 'model',
      //     url: '/roles',
      //     data: [],
      //     status: 200
      //   });
      // }


      const tablerows = UsersData.map(data => {
        return {
          id: data.id,
          name: data.name,
          role: data.role.name,
          buiesness: data.business.name
        }
      })

      const tabledata = new GenerateTable({
        name: "User",
        data: tablerows,
      });

      const response: ResponseInstance = {
        message: "Request successful",
        data: tabledata.policy(user,'users').addform('userform').gettable(),
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
  if (req.method == "POST") {
    try {
      const { name, password, email, role } = req.body;

      let buisness = await AppDataSource.getRepository(Business).findOne({ where: { id: 1 } });
      let userrole = await AppDataSource.getRepository(Roles).findOne({ where: { id: role } });

      const newUser = new Users();
      newUser.name = name;
      newUser.password = password;
      newUser.email = email;
      newUser.role = req.body.role;
      newUser.business = req.body.buisness;

      await AppDataSource.getRepository(Users).save(newUser);

      const response: ResponseInstance = {
        message: "User Created Successfully",
        data: [],
        status: 200,
      };

      res.json(response);
    } catch (e) {
      const response: ResponseInstance = {
        message: "Something went wrong while creating user",
        data: [e],
        status: 500,
      };
    }
  }

  if (req.method == "DELETE") {
    try {
      await UsersRepo
        .createQueryBuilder("buisness")
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
