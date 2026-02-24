import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        if (req.query.id !== "undefined" && req.query.id) {
            const area = await prisma.areaOfOperation.findUnique({
                where: { id: Number(req.query.id) }
            });

            if (!area) {
                return res.status(404).json({ message: "Area of operation not found", status: 404 });
            }

            const form = new GenerateForm('Edit Area of Operation');
            form.addField('name', 'text').value(area?.name).required();
            form.addField('email', 'email').value(area?.email);
            form.addField('number', 'text').value(area?.number).newRow();
            form.addField('address', 'text').value(area?.address);

            form.submiturl('getAreaOfOperationProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Add Area of Operation');
            form.addField('name', 'text').required();
            form.addField('email', 'email');
            form.addField('number', 'text').newRow();
            form.addField('address', 'text');

            form.submiturl('getAreaOfOperationProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}