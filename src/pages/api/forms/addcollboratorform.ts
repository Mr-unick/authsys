import { GenerateForm } from "../../../utils/generateForm";


export default async function handler(req, res) {

    const form = new GenerateForm('Add Collborator');

    form.addField('name', 'text').newRow().required();
   
    res.json(form.getForm());

}