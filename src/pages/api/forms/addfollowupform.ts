import { GenerateForm } from "../../../utils/generateForm";


export default async function handler(req, res) {

    const form = new GenerateForm('Set Follow-up');

    form.addField('follow-up', 'date').newRow().required();

    res.json(form.getForm());

}