import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
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
            form.addField('name', 'text').required();
            form.addField('email', 'email').required();
            form.addField('branch_code', 'text').required();
            form.addField('number', 'text').required();
            form.addField('address', 'text').required();
            form.addField('state', 'text').required();
            form.addField('district', 'text').required();
            form.addField('city', 'text').required();
            form.addField('pincode', 'text').required();
            form.addField('discription', 'textarea');

            form.submiturl('getBranchProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}