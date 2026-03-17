import prisma from "@/app/lib/prisma";
import { GenerateForm } from "../../../utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    const { id } = req.query;
    const form = new GenerateForm('Lead Form');

    try {
        // Check if multi-branch is enabled
        const multiBranchFeature = await prisma.businessFeature.findUnique({
            where: {
                business_id_feature_key: {
                    business_id: user.business || 0,
                    feature_key: 'multi_branch'
                }
            }
        });
        const isMultiBranchActive = multiBranchFeature?.is_enabled || false;

        const branches = isMultiBranchActive ? await prisma.branch.findMany({
            where: { business_id: user.business, deleted_at: null }
        }) : [];

        const branchOptions = branches.map((b: any) => ({
            id: b.id,
            name: b.name
        }));

        if (id !== "undefined" && id) {
            const lead = await prisma.lead.findUnique({
                where: { id: Number(id) }
            });

            form.addField('name', 'text').required().value(lead?.name || '');
            form.addField('email', 'text').value(lead?.email || '');

            if (isMultiBranchActive) {
                const bField = form.addField('branch', 'select').options(branchOptions).value((lead as any)?.branch_id);
                if (user.is_branch_admin) bField.disabled();
            }

            form.addField('phone', 'text').value(lead?.phone || '');
            form.addField('second_phone', 'text').value(lead?.second_phone || '');
            form.addField('address', 'textarea').value(lead?.address || '');
            form.addField('city', 'text').value(lead?.city || '');
            form.addField('state', 'text').value(lead?.state || '');
            form.addField('country', 'text').value(lead?.country || '');
            form.addField('pincode', 'text').value(lead?.pincode || '');
            form.addField('notes', 'textarea').newRow().value(lead?.notes || '');
            form.submiturl('getLeadProps');
            form.method('put');
        } else {
            form.addField('name', 'text').required();
            form.addField('email', 'text');

            if (isMultiBranchActive) {
                const bField = form.addField('branch', 'select').options(branchOptions);
                if (user.is_branch_admin) {
                    bField.value(user.branch).disabled();
                }
            }

            form.addField('phone', 'text');
            form.addField('second_phone', 'text');
            form.addField('address', 'textarea');
            form.addField('city', 'text');
            form.addField('state', 'text');
            form.addField('country', 'text');
            form.addField('pincode', 'text');
            form.addField('notes', 'textarea').newRow();
            form.submiturl('getLeadProps');
            form.method('post');
        }

        return res.json(form.getForm());
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}