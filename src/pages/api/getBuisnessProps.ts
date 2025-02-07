
import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";
import { ResponseInstance } from "../../utils/instances";
import { Business } from "../../app/entity/Business";
import { GenerateForm } from "../../utils/generateForm";
import { title } from "process";


export default async function handler(req, res) {
 const BusinesRepo = AppDataSource.getRepository(Business);
  if (req.method == "GET") {

    try {

      const BuisnesData = await BusinesRepo
        .createQueryBuilder("business")
        .getMany();

      const tablerows = BuisnesData.map(data=>{
      return  {
          id : data.id,
          name : data.name
        }
      })

      const tabledata = new GenerateTable({
        name: "Users",
        data: tablerows,
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

  if(req.method == "POST"){

    if(req.query.type == 'getform'){

          const formdata = new GenerateForm("User Form");

           let data = [
    {
      name: "gender",
      type: "select",
      label: "Gender",
      options: ["Male", "Female", "Other"],
      value: "Male",
      required: true, 
    },
    {
      name: "name",
      type: "text",
      label: "Enter Name",
      value: "",
      required: true,  
    },
    {
      name: "email",
      type: "email",
      label: "Enter Email",
      value: "",
      required: true, 
    },
    {
      name: "image",
      type: "file",
      label: "Select Profile",
      value: "",
      required: false, 
    },
    {
      name: "password",
      type: "password",
      label: "Enter Password",
      value: "",
      required: true, 
    },
    {
      name: "confirm password",
      type: "password",
      label: "Confirm Password",
      value: "",
      required: true,  
    },
    {
      name: "address",
      type: "text",
      label: "Enter your address",
      value: "",
      required: false, 
    },
    {
      name: "gender",
      type: "radiogroup",
      label: "Select Gender",
      options: ["Male", "Female", "Other"],
      required: true, 
    },
    {
      name: "adhar",
      type: "file",
      label: "Upload Adhar",
      value: "",
      required: false, 
    },
   
    {
      name: "agrred",
      type: "checkbox",
      label: "Agree to terms and conditions",
      value: "",
      required: true,  
      newRow: true,
      
    }, {
      name: "isbuisness",
      type: "switch",
      label: "Is Buisnes ?",
      value: "",
     
    },
    
  ];

          
          formdata.addField({
              name: 'name',
              type: 'text',
              label: 'Enter Your Name',
              value: '',
          }).newRow();
    
          formdata.addField({
              name: 'gender',
              type: 'select',
              label: 'Gender',
              options: ['Male', 'Female', 'Other'],
              value: '' 
          }).newRow();

          const response: ResponseInstance = {
            message: "get dat",
            data: {
              title:'Users',
              fields : data,
              submitUrl : ""
            },
            status: 200,
          };
        
          res.json(response);
        }else{

        }
    }
  
}
