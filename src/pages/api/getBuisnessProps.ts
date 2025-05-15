
import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";
import { ResponseInstance } from "../../utils/instances";
import { Business } from "../../app/entity/Business";
import {Users} from "../../app/entity/Users"
import { GenerateForm } from "../../utils/generateForm";
import { title } from "process";
import { VerifyToken } from "@/utils/VerifyToken";
import { Roles } from "@/app/entity";
import bcrypt from "bcrypt";


export default async function handler(req, res) {

  let user = await VerifyToken(req, res,'business'); // verify token and get user details
  const BusinesRepo = AppDataSource.getRepository(Business);
  if (req.method == "GET") {

    try {
      let BuisnesData;

      if(user?.business){
        BuisnesData = await BusinesRepo
          .createQueryBuilder("business")
          .where('business.id = :id', { id: user?.business })
          .getMany();
      }else{
        BuisnesData = await BusinesRepo
          .createQueryBuilder("business")
          .getMany();
      }

      

      const tablerows = BuisnesData.map(data => {
        return {
          id: data.id,
          name: data.business_name,
          gst_number: data.gst_number,
          pan_number: data.pan_number,
          business_address: data.business_address,
          city: data.city,
          state: data.state,
          pin_code: data.pin_code,
          contact_number: data.contact_number,
          email: data.email,
          website: data.website,
          owner_name: data.owner_name,
          owner_contact: data.owner_contact,
          owner_email: data.owner_email,
          business_description: data.business_description,
        }
      })

      console.log(user)

      const tabledata = new GenerateTable({
        name: "Buisness",
        data: tablerows,
      }).policy(user, 'business').addform('buisnessform').gettable();

      const response: ResponseInstance = {
        message: "Request successful",
        data: tabledata,
        status: 200,
      };

      res.json(response);
    } catch (e) {
      const response: ResponseInstance = {
        message: "Something Went Wrong",
        data: [{message:e.message}],
        status: 500,
      };

      res.json(response);
    }
  }

  if (req.method == "DELETE") {
    try {
      await BusinesRepo
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

  if (req.method == "POST") {

    try {
      const { business_name, gst_number, pan_number, business_address, city, state, pin_code, contact_number, email, website, owner_name, owner_contact, owner_email, business_description } = req.body;

      const newbuisness = new Business();
      newbuisness.business_name = business_name;
      newbuisness.gst_number = gst_number;
      newbuisness.pan_number = pan_number;
      newbuisness.business_address = business_address;
      newbuisness.city = city;
      newbuisness.state = state;
      newbuisness.pin_code = pin_code;
      newbuisness.contact_number = contact_number;
      newbuisness.email = email;
      newbuisness.website = website;
      newbuisness.owner_name = owner_name;
      newbuisness.owner_contact = owner_contact;
      newbuisness.owner_email = owner_email;
      newbuisness.business_description = business_description;


      const buisnessRepo = AppDataSource.getRepository(Business);

      const buisness = await buisnessRepo.save(newbuisness);

      
      let newuser = new Users();

      let role = await AppDataSource.getRepository(Roles).findOne({
        where:{
          name:'Buisness Admin'
        }
      });

      
      newuser.business = newbuisness;
      newuser.email = owner_email
      newuser.name = owner_name;

      
      
      const hash = bcrypt.hashSync('pass', 10)

      newuser.password = hash;

      if(role !== null){
        newuser.role =role
      };


      try{
        await AppDataSource.getRepository(Users).save(newuser);
      }catch(e){
        console.log(e.message)
      }

      const response: ResponseInstance = {
        message: "Buisness created successfully",
        data: buisness,
        status: 200,
      };

      res.json(response);

    } catch (error) {
      const response: ResponseInstance = {
        message: "Something went wrong while creating buisness",
        data: [error],
        status: 500,
      };
      res.json(response);

    }


  }

}
