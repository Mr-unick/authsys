import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

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

        const permissions = await prisma.permission.findMany({
            where: { deleted_at: null }
        });

        const permissionOptions = permissions.map(p => ({
            id: p.id,
            name: `${p.permission} (${p.action})`
        }));

        if (req.query.id !== "undefined" && req.query.id) {
            const role = await prisma.role.findUnique({
                where: { id: Number(req.query.id) },
                include: { rolePermissions: true }
            });

            if (!role) {
                return res.status(404).json({ message: "Role not found", status: 404 });
            }

            const form = new GenerateForm('Edit Role');
            form.addField('name', 'text').value(role.name).required();

            if (isMultiBranchActive) {
                const bField = form.addField('branch', 'select').options(branchOptions).value((role as any).branch_id).required().newRow();
                if (user.is_branch_admin) bField.disabled();
            }

            form.addField('permissions', 'select').options(permissionOptions).value(role.rolePermissions.map(rp => rp.permission_id) as any).required();
            form.submiturl('getRoleProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Create Role');
            form.addField('name', 'text').required();

            if (isMultiBranchActive) {
                const bField = form.addField('branch', 'select').options(branchOptions).required();
                if (user.is_branch_admin) {
                    bField.value(user.branch).disabled();
                }
            }

            form.addField('permissions', 'select').options(permissionOptions).required();
            form.submiturl('getRoleProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}
