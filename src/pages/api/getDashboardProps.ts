import generateDashboard from "@/utils/generatedashboard";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";





export default async function getDashboardProps(req,res) {
    
let user = await VerifyToken(req,res,null)

 try {

    let dashboardProps : any;
    dashboardProps = generateDashboard(user);
    
    const response : ResponseInstance = {
        message : 'Dashboard props fetched successfully',
        data : dashboardProps,
        status : 200
    }

     res.json(response);
 } catch (error) {
    res.status(500).json({ error: error.message });
 }
}
