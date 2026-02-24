import prisma from "@/app/lib/prisma";
import { GenerateForm } from "@/utils/generateForm";
import { VerifyToken } from "@/utils/VerifyToken";

export default async function handler(req: any, res: any) {
    const user = await VerifyToken(req, res, null);
    if (res.writableEnded) return;

    try {
        if (req.query.id !== "undefined" && req.query.id) {
            const business = await prisma.business.findUnique({
                where: { id: Number(req.query.id) }
            });

            if (!business) {
                return res.status(404).json({ message: "Business not found", status: 404 });
            }

            const form = new GenerateForm('Update Business');
            form.addField('business_name', 'text').value(business.business_name);
            form.addField('gst_number', 'text').value(business.gst_number);
            form.addField('pan_number', 'text').value(business.pan_number);
            form.addField('business_address', 'text').value(business.business_address);
            form.addField('city', 'text').value(business.city);
            form.addField('state', 'text').value(business.state);
            form.addField('pin_code', 'text').value(business.pin_code);
            form.addField('contact_number', 'text').value(business.contact_number);
            form.addField('email', 'email').value(business.email);
            form.addField('website', 'text').value(business.website);
            form.addField('owner_name', 'text').value(business.owner_name);
            form.addField('owner_contact', 'text').value(business.owner_contact);
            form.addField('owner_email', 'email').value(business.owner_email);
            form.addField('business_description', 'textarea').value(business.business_description);

            form.submiturl('getBuisnessProps');
            form.method('put');

            return res.status(200).json(form.getForm());
        } else {
            const form = new GenerateForm('Add New Business');
            form.addField('business_name', 'text');
            form.addField('gst_number', 'text');
            form.addField('pan_number', 'text');
            form.addField('business_address', 'text');
            form.addField('city', 'text');
            form.addField('state', 'text');
            form.addField('pin_code', 'text');
            form.addField('contact_number', 'text');
            form.addField('email', 'email');
            form.addField('website', 'text');
            form.addField('owner_name', 'text');
            form.addField('owner_contact', 'text');
            form.addField('owner_email', 'email');
            form.addField('business_description', 'textarea');

            form.submiturl('getBuisnessProps');
            form.method('post');

            return res.status(200).json(form.getForm());
        }
    } catch (error: any) {
        return res.status(500).json({ message: "Something went wrong", error: error.message, status: 500 });
    }
}