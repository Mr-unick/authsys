import prisma from "@/app/lib/prisma";
import { GenerateTable } from "../../utils/generateTable";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    let user = await VerifyToken(req, res, "freshleads");
    if (res.writableEnded) return;

    if (req.method == "GET") {
        try {
            const whereClause: any = {
                business_id: user.business,
                deleted_at: null,
                leadUsers: {
                    none: {},
                },
            };

            const totalCount = await prisma.lead.count({
                where: {
                    business_id: user.business,
                    deleted_at: null,
                },
            });

            const leadRows = await prisma.lead.findMany({
                where: whereClause,
                include: {
                    leadUsers: { include: { user: true } },
                    stage: true,
                },
                take: 10,
            });

            const leads = leadRows.map((data: any) => {
                const collaborators =
                    data?.leadUsers?.map((lu: any) => lu.user?.name) || [];

                return {
                    id: data.id,
                    name: data?.name || "-",
                    email: data?.email || "-",
                    address: data?.address || "-",
                    phone: data?.phone || "-",
                    second_phone: data?.second_phone || "-",
                    status: true,
                    collborators: collaborators,
                    headcollborator: (data as any).headcollborator || "Nikhil Lende",
                    nextfollowup: (data as any).nextfollowup || "-",
                    lead_source: data?.lead_source || "-",
                    note: data?.notes || "-",
                };
            });

            const tabledata = new GenerateTable({
                name: "Leads",
                data: leads,
            })
                .policy(user, "freshleads")
                .addform("leadform")
                .gettable();

            const response = {
                message: "Request successful",
                data: {
                    ...tabledata,
                    upload: true,
                },
                status: 200,
                count: totalCount,
            };

            return res.json(response);
        } catch (error: any) {
            return res.status(500).json({
                message: "Something went wrong",
                error: error.message,
                status: 500,
            });
        }
    }

    // ---- SOFT DELETE ----
    if (req.query.delete) {
        try {
            const ids = req.body.leads?.map((item: any) => item.id);
            if (!ids || ids.length === 0) {
                return res
                    .status(400)
                    .json({
                        status: 400,
                        message: "No records specified for deletion",
                        data: [],
                    });
            }

            await prisma.lead.updateMany({
                where: { id: { in: ids } },
                data: { deleted_at: new Date() },
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
                error: error.message,
            });
        }
    }

    return res
        .status(405)
        .json({ message: "Method not allowed", data: [], status: 405 });
}
