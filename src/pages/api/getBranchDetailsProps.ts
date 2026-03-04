import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { ResponseInstance } from "../../utils/instances";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'branches');
    if (res.writableEnded) return;

    if (!user.branch) {
        return res.status(400).json({ message: "No branch associated with this account", status: 400 });
    }

    if (req.method === "GET") {
        try {
            const branch = await prisma.branch.findUnique({
                where: { id: user.branch },
                include: {
                    business: true,
                    users: {
                        where: { is_branch_admin: true },
                        take: 1
                    }
                }
            });

            if (!branch) {
                return res.status(404).json({ message: "Branch not found", status: 404 });
            }

            const branchRow = {
                id: branch.id,
                name: branch.name,
                branch_code: branch.branch_code,
                email: branch.email,
                number: branch.number,
                address: branch.address,
                city: branch.city,
                state: branch.state,
                district: branch.district,
                pincode: branch.pincode,
                discription: branch.discription,
                manager_name: branch.users[0]?.name || 'N/A',
                manager_email: branch.users[0]?.email || 'N/A',
            };

            const table = new GenerateTable({
                name: "Branch Details",
                data: [branchRow],
            }).policy(user, 'branches');

            // Allow updates for Branch Manager
            if (user.is_branch_admin) {
                table.addform('branchdetailsform');
            }

            return res.status(200).json({
                status: 200,
                message: "Branch details fetched successfully",
                data: table.gettable(),
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Something went wrong",
                data: [error.message],
            });
        }
    }

    if (req.method === "PUT") {
        try {
            if (!user.is_branch_admin) {
                return res.status(403).json({ message: "Forbidden", status: 403 });
            }

            const { name, email, number, address, city, state, district, pincode, discription } = req.body;

            const updatedBranch = await prisma.branch.update({
                where: { id: user.branch },
                data: {
                    name,
                    email,
                    number,
                    address,
                    city,
                    state,
                    district,
                    pincode,
                    discription
                }
            });

            return res.status(200).json({
                status: 200,
                message: "Branch details updated successfully",
                data: updatedBranch,
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 500,
                message: "Update failed",
                data: [error.message],
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed", data: [], status: 405 });
}
