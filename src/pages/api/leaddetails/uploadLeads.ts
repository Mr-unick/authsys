import { Leads } from "@/app/entity/Leads";
import { Users } from "@/app/entity/Users";
import { AppDataSource } from "@/app/lib/data-source";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function uploadLeads(req, res) {

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    let user = await VerifyToken(req, res, null);
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { leads } = req.body;
       
        if (!leads  || !Array.isArray(leads) ) {
            return res.status(400).json({ message: 'Invalid request body' });
        }


        let leadsBatch = leads.map(lead=>{
            let newLead = new Leads();

                newLead.name = lead.name,
                newLead.email = lead.email ,
                newLead.address = lead?.address,
                newLead.business = user.business,
                newLead.phone = lead?.phone,
                newLead.second_phone = lead?.second_phone,
                newLead.created_at = new Date(),
                newLead.updated_at = new Date()
              
                
            return newLead;
        })
      
        await AppDataSource.getRepository(Leads).insert(leadsBatch);
        
        const response: ResponseInstance = {
            message: 'Leads uploaded successfully',
            data: [],
            status: 200
        }  
        return res.json(response);
    } catch (error) {
        const response: ResponseInstance = {
            message: 'Leads assigned failed',
            data: [error.message],
            status: 500
        }
        return res.json(response);
    }
}

