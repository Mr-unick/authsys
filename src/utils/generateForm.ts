import { FormInstance, InputField } from "./instances";





export class GenerateForm {

    private form : FormInstance;

    private fields: InputField[] = [];

    private field : InputField;
    
    private name : string;

    constructor(name : string) {

     this.form = { title: "", fields: [] ,submiturl:''}; 
     this.form.title = name ;
     this.form.fields =this.fields;
    
    }

    addField(field: InputField): this {
        field.required = false;
        field.newRow =false;
        this.field = field;
        this.fields.push(field);
        return this;
    }

    required(){
        this.field.required = true;
        return this;
    }
    newRow(){
        this.field.newRow = true;
        return this;
    }

    getForm(){
        return this.form;
    }

    

}
