import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'branches');
    if (res.writableEnded) return;

    if (req.method === "GET") {
        try {
            let branchData;
            if (user?.business) {
                branchData = await prisma.branch.findMany({
                    where: {
                        business_id: user.business,
                        deleted_at: null
                    }
                });
            } else {
                branchData = await prisma.branch.findMany({
                    where: {
                        deleted_at: null
                    }
                });
            }

            const tableData = new GenerateTable({
                name: "Branches",
                data: branchData,
            }).policy(user, 'branches').addform('branchform').gettable();

            return res.status(200).json({
                status: 200,
                message: "Branches fetched successfully",
                data: tableData,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: [error.message],
            });
        }
    }

    if (req.method === "POST") {
        try {
            const { name, email, branch_code, number, address, state, district, city, pincode, discription, buisness: buisnessId } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: 400,
                    message: "Branch name is required",
                    data: [],
                });
            }

            const targetBusinessId = buisnessId || user.business;

            const newBranch = await prisma.branch.create({
                data: {
                    name,
                    email,
                    branch_code,
                    number,
                    address,
                    state,
                    district,
                    city,
                    pincode,
                    discription,
                    location: '',
                    business_id: Number(targetBusinessId)
                }
            });

            return res.status(201).json({
                status: 201,
                message: "Branch created successfully",
                data: newBranch,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: [error.message],
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

            await prisma.branch.updateMany({
                where: { id: { in: ids } },
                data: { deleted_at: new Date() }
            });

            return res.status(200).json({
                status: 200,
                message: "Records deleted successfully",
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

    return res.status(405).json({ message: "Method not allowed", data: [], status: 405 });
}
