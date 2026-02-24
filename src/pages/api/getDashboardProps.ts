import generateDashboard from "@/utils/generatedashboard";
import { ResponseInstance } from "@/utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";
import fs from 'fs';

export default async function getDashboardProps(req, res) {

    let user = await VerifyToken(req, res, null)
    if (res.writableEnded) return;

    try {

        let dashboardProps: any;
        dashboardProps = await generateDashboard(user);


        const response: ResponseInstance = {
            message: 'Dashboard props fetched successfully',
            data: dashboardProps,
            status: 200
        }

        res.json(response);
    } catch (error) {
        fs.appendFileSync('api_error.txt', `\n[${new Date().toISOString()}] API ERROR: ${error.stack || error.message}\n`);
        console.error("[getDashboardProps ERROR]", error);
        res.status(500).json({ error: error.message });
    }
}
