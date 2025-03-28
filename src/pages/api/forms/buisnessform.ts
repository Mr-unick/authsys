import { Users } from "lucide-react";
import { AppDataSource } from "../../../app/lib/data-source";
import { GenerateForm } from "../../../utils/generateForm";
import { UserRepository } from "../../../app/reposatory/userRepo";
import { BuisnessRepository } from "@/app/reposatory/buisnessRepo";


export default async function handler(req, res) {

    if (req.query.id != "undefined") {

        // we are not recinving any id means the request is create

        const BuisnessRepo = await BuisnessRepository.onlyPermit(1);

        const buisness = await BuisnessRepo.where("buisness.id = :id", { id: req.query.id }).getOne();

        const {
            business_name,
            gst_number,
            pan_number,
            business_address,
            city,
            state,
            pin_code,
            contact_number,
            email,
            website,
            owner_name,
            owner_contact,
            owner_email,
            business_description,
        } = buisness;

        const form = new GenerateForm('Update Business');

        form.addField('business_name', 'text').value(business_name); 
        form.addField('gst_number', 'text').value(gst_number); 
        form.addField('pan_number', 'text').value(pan_number); 
        form.addField('business_address', 'text').value(business_address); 
        form.addField('city', 'text').value(city); 
        form.addField('state', 'text').value(state); 
        form.addField('pin_code', 'text').value(pin_code); 
        form.addField('contact_number', 'text').value(contact_number); 
        form.addField('email', 'email').value(email); 
        form.addField('website', 'text').value(website); 

        form.addField('owner_name', 'text').value(owner_name); 
        form.addField('owner_contact', 'text').value(owner_contact); 
        form.addField('owner_email', 'email').value(owner_email); 

        form.addField('business_description', 'textarea').value(business_description); 

        form.newRow();
        form.submiturl('getBuisnessProps');
        form.method('put');
        res.json(form.getForm());

    } else {


        // we are not recinving any id means the request is Update

        const form = new GenerateForm('Add New Business');


        form.addField('business_name', 'text'); // Name of the Business
        form.addField('gst_number', 'text'); // GST Registration Number
        form.addField('pan_number', 'text'); // PAN Number (for Taxation)
        form.addField('business_address', 'text'); // Address of the Business
        form.addField('city', 'text'); // City
        form.addField('state', 'text'); // State
        form.addField('pin_code', 'text'); // Postal Code
        form.addField('contact_number', 'text'); // Business Contact Number
        form.addField('email', 'email'); // Business Email Address
        form.addField('website', 'text'); // Website (if applicable)

        form.addField('owner_name', 'text'); // Name of the Business Owner
        form.addField('owner_contact', 'text'); // Owner Contact Information
        form.addField('owner_email', 'email'); // Owner Email

        form.addField('business_description', 'textarea'); // Business Description / Nature of Business

        // To ensure the form looks neat:
        form.newRow();
        form.submiturl('getBuisnessProps');
        form.method('post');


        res.json(form.getForm());

    }



}