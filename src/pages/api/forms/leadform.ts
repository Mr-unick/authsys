import prisma from "@/app/lib/prisma";
import { GenerateForm } from "../../../utils/generateForm";

export default async function handler(req: any, res: any) {
    const { id } = req.query;
    const form = new GenerateForm('Lead Form');

    if (id !== "undefined" && id) {
        const lead = await prisma.lead.findUnique({
            where: { id: Number(id) }
        });

        form.addField('name', 'text').required().value(lead?.name || '').disabled();
        form.addField('email', 'text').value(lead?.email || '').disabled();
        form.addField('phone', 'text').value(lead?.phone || '').disabled();
        form.addField('second_phone', 'text').value(lead?.second_phone || '');
        form.addField('address', 'textarea').newRow().value(lead?.address || '');
        form.submiturl('getLeadProps');
        form.method('put');
    } else {
        form.addField('name', 'text').required();
        form.addField('email', 'text');
        form.addField('phone', 'text');
        form.addField('second_phone', 'text');
        form.addField('address', 'textarea');
        form.submiturl('getLeadProps');
        form.method('post');
    }

    res.json(form.getForm());
}