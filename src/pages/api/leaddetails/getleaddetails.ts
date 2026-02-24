import prisma from "@/app/lib/prisma";
import { haspermission } from "@/utils/authorization";
import { VerifyToken } from "@/utils/VerifyToken";

export const getleadDetails = async (user: any, id: any) => {
    try {
        const leadid = Number(id);

        const lead = await prisma.lead.findUnique({
            where: { id: leadid },
            include: {
                leadUsers: { include: { user: true } },
                stage: true,
                history: {
                    include: {
                        stage: true,
                        user: true
                    },
                    orderBy: {
                        changed_at: 'desc'
                    }
                },
                comments: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                },
                business: true
            }
        });

        if (!lead) {
            return {
                status: 404,
                message: "Lead not found",
                data: []
            };
        }

        const stageName = lead.stage?.stage_name;

        const history = lead.history?.map((item) => ({
            stage: item.stage,
            changedAt: item.changed_at,
            changedBy: item.user,
            reason: item.reason,
        })) || [];

        const leaddetails = {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            secondPhone: lead.second_phone || "No second phone",
            address: lead.address,
            city: lead.city || "Mumbai",
            state: lead.state || "Maharashtra",
            country: lead.country || "India",
            pincode: lead.pincode || "411001",
            leadStatus: lead.status || "active",
            leadSource: lead.lead_source || "Website",
            leadStage: stageName,
            notes: lead.notes || "No notes",
            nextFollowUp: lead.nextFollowUp,
            collaborators: lead.leadUsers?.map((lu: any) => lu.user) || [],
            stageChangeHistory: history,
            comments: lead.comments || [],
            addcollborator: haspermission(user, 'assign_collborators'),
            deletecollborator: haspermission(user, 'delete_collborators'),
            viewcollborator: haspermission(user, 'view_collborators'),
            addcomment: haspermission(user, 'add_comment'),
            deletecomment: haspermission(user, 'delete_comment'),
            editcomment: haspermission(user, 'edit_comment'),
            viewcomment: haspermission(user, 'view_comment'),
            changestage: haspermission(user, 'add_stage'),
            deletestage: haspermission(user, 'delete_stage'),
            editstage: haspermission(user, 'edit_stage'),
            viewstage: haspermission(user, 'view_stage'),
            allStages: await prisma.leadStage.findMany({
                where: { business_id: lead.business_id, deleted_at: null },
                orderBy: { id: 'asc' }
            }),
            navigation: {
                previous: (await prisma.lead.findFirst({
                    where: { id: { lt: leadid }, business_id: lead.business_id, deleted_at: null },
                    orderBy: { id: 'desc' },
                    select: { id: true }
                }))?.id || null,
                next: (await prisma.lead.findFirst({
                    where: { id: { gt: leadid }, business_id: lead.business_id, deleted_at: null },
                    orderBy: { id: 'asc' },
                    select: { id: true }
                }))?.id || null
            }
        };

        return {
            status: 200,
            message: "Lead found",
            data: leaddetails
        };

    } catch (error: any) {
        return {
            status: 500,
            message: "Internal server error",
            data: error.message
        };
    }
}

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, 'leaddetails');
    if (res.writableEnded) return;

    const leadid = req.query.id;
    const response = await getleadDetails(user, leadid);

    const status = response.status || 200;
    return res.status(status).json(response);
}
