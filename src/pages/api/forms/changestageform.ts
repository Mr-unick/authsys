import prisma from "@/app/lib/prisma";
import { GenerateForm } from "../../../utils/generateForm";

export default async function handler(req: any, res: any) {
    const form = new GenerateForm('Change Lead Stage');

    const leadId = Number(req.query.id);
    const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { business_id: true } });

    const stages = await prisma.leadStage.findMany({
        where: { business_id: lead?.business_id || 0, deleted_at: null },
        orderBy: { id: 'asc' }
    });
    const options = stages.map((stage: any) => ({ id: stage.id, name: stage.stage_name }));

    form.addField('stage', 'select').newRow().options(options);
    form.addField('reason', 'textarea').newRow().required();
    form.submiturl('leaddetails/changeLeadStage');
    form.method('put');

    res.json(form.getForm());
}