import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        // Check if multi-branch is enabled
        const multiBranchFeature = await prisma.businessFeature.findUnique({
            where: { business_id_feature_key: { business_id: user.business || 0, feature_key: 'multi_branch' } }
        });
        const isMultiBranchActive = multiBranchFeature?.is_enabled || false;

        const branches = isMultiBranchActive ? await prisma.branch.findMany({
            where: { business_id: user.business, deleted_at: null }
        }) : [];

        const branchOptions = branches.map((b: any) => ({
            id: b.id,
            name: b.name
        }));

        if (req.query.id !== "undefined" && req.query.id) {
            const stage = await prisma.leadStage.findUnique({
                where: { id: Number(req.query.id) },
                select: {
                    stage_name: true,
                    colour: true,
                    discription: true,
                    order: true,
                    stage_type: true,
                    branch_id: true
                }
            });

            if (!stage) {
                return res.status(404).json({
                    message: "Stage not found",
                    data: [],
                    status: 404,
                });
            }

            const form = new GenerateForm('Edit Lead Stage');
            form.addField('stage_name', 'text').value(stage.stage_name).required();

            if (isMultiBranchActive) {
                form.addField('branch', 'select').options(branchOptions).value(stage.branch_id).required().newRow();
            }

            form.addField('colour', 'color').value(stage.colour);
            form.addField('order', 'text').value(stage.order);
            form.addField('stage_type', 'select').value(stage.stage_type).options([
                { id: 'ONGOING', name: 'Ongoing' },
                { id: 'WON', name: 'Won (Closed)' },
                { id: 'LOST', name: 'Lost' },
            ]).required();
            form.addField('discription', 'textarea').newRow().value(stage.discription);
            form.submiturl('getLeadStagesProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Create Lead Stage');
            form.addField('stage_name', 'text').required();

            if (isMultiBranchActive) {
                form.addField('branch', 'select').options(branchOptions).required();
            }

            form.addField('colour', 'color').required();
            form.addField('order', 'text').required();
            form.addField('stage_type', 'select').value('ONGOING').options([
                { id: 'ONGOING', name: 'Ongoing' },
                { id: 'WON', name: 'Won (Closed)' },
                { id: 'LOST', name: 'Lost' },
            ]).required();
            form.addField('discription', 'textarea').required().newRow();
            form.submiturl('getLeadStagesProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}