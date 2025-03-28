import { GenerateTable } from "../../utils/generateTable";
import { AppDataSource } from "../../app/lib/data-source";

import { ResponseInstance } from "../../utils/instances";
import { AreaOfOperation } from "../../app/entity/AreaOfOperation";
import { VerifyToken } from "@/utils/VerifyToken";



export default async function handler(req, res) {
    try {
        let user = await VerifyToken(req, res, 'area_of_operation');
        const AreaOfOperationRepo = AppDataSource.getRepository(AreaOfOperation);

        const AreaOfOperationData = await AreaOfOperationRepo.find();

        const tableData =new GenerateTable({
            name: "Area Of Operation",
            data: AreaOfOperationData,
        }).policy(user,'area_of_operation').addform('areaofoperationform').gettable();

        const response : ResponseInstance = {
            status:200,
            message:'Area of Operation fetched successfully',
            data:tableData
        }

         res.json(response);
    } catch (error) {
        const response : ResponseInstance = {
            status:500,
            message:'Something Went Wrong',
            data:error
        }

         res.json(response);
    }
}
