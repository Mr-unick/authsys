import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const userContext = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    if (!userContext) {
        return res.status(401).json({
            message: "Unauthorized",
            status: 401,
        });
    }

    try {
        const roles = await prisma.role.findMany({
            where: {
                business_id: userContext.business,
                // Only SuperAdmins can see/assign the highest administrative roles
                ...(userContext.role !== 'SUPER_ADMIN' ? {
                    NOT: {
                        name: { in: ['Buisness Admin', 'Business Admin', 'Admin'] }
                    }
                } : {})
            }
        });

        // Check if multi-branch is enabled
        const multiBranchFeature = await prisma.businessFeature.findUnique({
            where: {
                business_id_feature_key: {
                    business_id: userContext.business || 0,
                    feature_key: 'multi_branch'
                }
            }
        });
        const isMultiBranchActive = multiBranchFeature?.is_enabled || false;

        const branches = isMultiBranchActive ? await prisma.branch.findMany({
            where: { business_id: userContext.business, deleted_at: null }
        }) : [];

        const branchOptions = branches.map((b: any) => ({
            id: b.id,
            name: b.name
        }));

        const roleOptions = roles.map((role: any) => ({
            id: role.id,
            name: role.name
        }));

        if (req.query.id !== "undefined" && req.query.id) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    id: Number(req.query.id),
                    business_id: userContext.business
                },
                include: {
                    role: true
                }
            });

            if (!existingUser) {
                return res.status(404).json({ message: "User not found", status: 404 });
            }

            const form = new GenerateForm('User Form');

            form.addField('name', 'text').value(existingUser?.name).required();
            form.addField('email', 'email').value(existingUser?.email);
            form.addField('number', 'text').value((existingUser as any)?.number).newRow();
            form.addField('address', 'textarea').newRow().value((existingUser as any)?.address);
            form.addField('gender', 'select').value((existingUser as any)?.gender).options([
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' },
                { id: 'other', name: 'Other' },
            ]);
            form.addField('role', 'select').options(roleOptions).value(existingUser?.role_id).required();

            if (isMultiBranchActive) {
                // If Branch Admin, they cannot change their own branch or assign others to different branches
                if (userContext.is_branch_admin) {
                    form.addField('branch', 'select').options(branchOptions).value(existingUser?.branch_id).disabled().required().newRow();
                } else {
                    form.addField('branch', 'select').options(branchOptions).value(existingUser?.branch_id).required().newRow();
                    form.addField('is_branch_admin', 'switch').value(existingUser?.is_branch_admin).newRow().label('Branch Manager (One per branch)');
                }
            }

            form.addField('old_password', 'password');
            form.addField('new_password', 'password');

            form.submiturl('getUserProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Create User');

            form.addField('name', 'text').required();
            form.addField('email', 'email').required();
            form.addField('address', 'textarea').newRow().required();
            form.addField('gender', 'select').value('male').options([
                { id: 'male', name: 'Male' },
                { id: 'female', name: 'Female' },
                { id: 'other', name: 'Other' },
            ]);
            form.addField('role', 'select').options(roleOptions).required();

            if (isMultiBranchActive) {
                if (userContext.is_branch_admin) {
                    // Auto-bind to current branch
                } else {
                    form.addField('branch', 'select').options(branchOptions).required().newRow();
                    form.addField('is_branch_admin', 'switch').value(false).newRow().label('Branch Manager (One per branch)');
                }
            }

            form.addField('password', 'password').required();
            form.addField('confirm_password', 'password').required();

            form.submiturl('getUserProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
            status: 500,
        });
    }
}