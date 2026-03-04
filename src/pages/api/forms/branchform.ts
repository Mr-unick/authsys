import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
        const role = rawRole.trim().toUpperCase().replace(/\s+/g, '_');
        const isPortalAdmin = role.includes('SUPER') || (user.permissions || []).includes('*');

        if (req.query.id !== "undefined" && req.query.id) {
            const branch = await prisma.branch.findUnique({
                where: { id: Number(req.query.id) }
            });

            if (!branch) {
                return res.status(404).json({ message: 'Branch not found', status: 404 });
            }

            const form = new GenerateForm('Edit Branch');
            form.addField('name', 'text').value(branch.name).required();
            form.addField('email', 'email').value(branch.email).required();
            form.addField('branch_code', 'text').value(branch.branch_code).required();
            form.addField('number', 'text').value(branch.number).required();
            form.addField('address', 'text').value(branch.address).required();
            form.addField('state', 'text').value(branch.state).required();
            form.addField('district', 'text').value(branch.district).required();
            form.addField('city', 'text').value(branch.city).required();
            form.addField('pincode', 'text').value(branch.pincode).required();
            form.addField('discription', 'textarea').value(branch.discription);

            form.submiturl('getBranchProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Add New Branch');

            if (isPortalAdmin) {
                // Fetch all businesses for Super Admin to select from
                const businesses = await prisma.business.findMany({
                    where: { deleted_at: null },
                    select: { id: true, business_name: true }
                });

                form.addField('buisness', 'select')
                    .options(businesses.map(b => ({ label: b.business_name, value: b.id.toString() })))
                    .required()
                    .label('Target Business');
            }

            form.addField('name', 'text').required();
            form.addField('email', 'email').required();
            form.addField('branch_code', 'text').required();
            form.addField('number', 'text').required();
            form.addField('address', 'text').required();
            form.addField('state', 'text').required();
            form.addField('district', 'text').required();
            form.addField('city', 'text').required();
            form.addField('pincode', 'text').required();
            form.addField('discription', 'textarea').newRow();

            // Branch Manager Details
            form.addField('admin_name', 'text').required().newRow().label('Branch Manager Name');
            form.addField('admin_email', 'email').required().label('Branch Manager Email');
            form.addField('admin_password', 'password').required().label('Branch Manager Password');

            form.submiturl('getBranchProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        console.error("[BranchForm Error]:", error);
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}