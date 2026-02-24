import { GenerateForm } from "../../../utils/generateForm";


export default async function handler(req, res) {

    const form = new GenerateForm('Set Follow-up');

    form.addField('follow_up_date', 'date').required();
    form.addField('follow_up_time', 'time').required();
    form.submiturl('leaddetails/setfollowup');

    res.json(form.getForm());

}