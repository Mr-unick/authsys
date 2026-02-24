import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    let user = await VerifyToken(req, res, 'area_of_operation');
    if (res.writableEnded) return;

    if (req.method == "GET") {
        try {
            const areaOfOperationData = await prisma.areaOfOperation.findMany({
                where: {
                    business_id: user.business,
                    deleted_at: null
                }
            });

            const tableData = new GenerateTable({
                name: "Area Of Operation",
                data: areaOfOperationData,
            }).policy(user, 'area_of_operation').addform('areaofoperationform').gettable();

            const response: ResponseInstance = {
                status: 200,
                message: 'Area of Operation fetched successfully',
                data: tableData
            };

            return res.json(response);
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: 'Something Went Wrong',
                data: error.message
            });
        }
    }

    // ---- SOFT DELETE ----
    if (req.query.delete) {
        try {
            const ids = req.body.leads?.map((item: any) => item.id);
            if (!ids || ids.length === 0) {
                return res.status(400).json({ status: 400, message: "No records specified for deletion", data: [] });
            }

            await prisma.areaOfOperation.updateMany({
                where: { id: { in: ids } },
                data: { deleted_at: new Date() }
            });

            return res.status(200).json({
                status: 200,
                message: "Deleted successfully",
                data: [],
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Deletion failed",
                data: [error.message],
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed", status: 405 });
}
