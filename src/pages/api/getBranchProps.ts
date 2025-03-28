import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";

import { ResponseInstance } from "../../utils/instances";
import { Branch } from "../../app/entity/Branch";
import { Business } from "../../app/entity/Business";
import { VerifyToken } from "@/utils/VerifyToken";




export default async function handler(req, res) {

    let user = await VerifyToken(req, res, 'branches');

    if(req.method == "GET"){
        try {
            const BranchRepo = AppDataSource.getRepository(Branch);

            const BranchData = await BranchRepo.find();

            const tableData = new GenerateTable({
                name: "Branches",
                data: BranchData,
            }).policy(user,'branches').addform('branchform').gettable();

            const response: ResponseInstance = {
                status: 200,
                message: 'Branches fetched successfully',
                data: tableData
            }

            res.json(response);
        } catch (error) {
            const response: ResponseInstance = {
                status: 500,
                message: 'Something Went Wrong',
                data: error
            }

            res.json(response);
        }
    }

    if(req.method == "POST"){
        try {
            const {name,email,branch_code,number,address,state,district,city,pincode,discription} = req.body;

            let business = await AppDataSource.getRepository(Business).findOne({where:{id:1}});

            const newBranch = new Branch();
            newBranch.name = name;
            newBranch.email = email;
            newBranch.branch_code = branch_code;
            newBranch.number = number;          
            newBranch.address = address;
            newBranch.state = state;
            newBranch.district = district;
            newBranch.city = city;
            newBranch.pincode = pincode;
            newBranch.discription = discription;
            newBranch.location = 'nothing for now';
            newBranch.buisness = business;

            await AppDataSource.getRepository(Branch).save(newBranch);

            const response: ResponseInstance = {
                status: 200,
                message: 'Branch created successfully', 
                data: newBranch
            }

            res.json(response);

        } catch (error) {
            const response: ResponseInstance = {
                status: 500,
                message: 'Something Went Wrong',
                data: error
            }

            res.json(response); 
        }
    }
}
