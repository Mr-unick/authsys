import { LeadStages } from "../../app/entity/LeadStages";
import { AppDataSource } from "../../app/lib/data-source";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";




export default async function handler(req, res) {
    try{
     
        let stages =await AppDataSource.getRepository(LeadStages).createQueryBuilder('stages').limit(10).getMany();

        const tabledata = new GenerateTable({
                name: "Lead Stages",
                data: stages,
        });

      //  console.log(tabledata)

        const response: ResponseInstance = {
                message: "Succes",
                data: tabledata,
                status: 500,
              };

        res.json(response)

    }catch(e){

        const response: ResponseInstance = {
            message: "Something Went Wrong",
            data: [],
            status: 500,
          };

          res.json(response)
    }
}