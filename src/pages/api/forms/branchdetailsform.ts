import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    if (!user.branch) {
        return res.status(400).json({ message: "No branch associated", status: 400 });
    }

    try {
        const branch: any = await prisma.branch.findUnique({
            where: { id: user.branch }
        });

        if (!branch) {
            return res.status(404).json({ message: "Branch not found", status: 404 });
        }

        const form = new GenerateForm('Update Branch Details');
        form.addField('name', 'text').value(branch.name).required();
        form.addField('email', 'email').value(branch.email);
        form.addField('number', 'text').value(branch.number);
        form.addField('address', 'textarea').value(branch.address).newRow();
        form.addField('city', 'text').value(branch.city);
        form.addField('state', 'text').value(branch.state);
        form.addField('district', 'text').value(branch.district);
        form.addField('pincode', 'text').value(branch.pincode);
        form.addField('discription', 'textarea').value(branch.discription).newRow();

        form.submiturl('getBranchDetailsProps');
        form.method('put');

        return res.status(200).json(form.getForm());
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}
