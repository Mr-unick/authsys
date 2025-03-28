import { Value } from "@radix-ui/react-select";
import { FieldType, FormInstance, InputField } from "./instances";





export class GenerateForm {

    private form : FormInstance;

    private fields: InputField[] = [];

    private field : InputField;
    
    private name : string;

    

    constructor(name : string ,method : string = 'post') {

     this.form = { title: "", fields: [] ,submiturl:'' , method:method}; 
     this.form.title = name ;
     this.form.fields =this.fields;
    
    }

    // {
    //     name: "colour",
    //     type: "color",
    //     label: "Address",
    //     placeholder :"Enter your address",
    //     value: "",
    //     required: false, 
    // },
    

    addField(name: string, type: FieldType): this {

        let newplaceholder = name.replace(/_/g, ' ');

// Capitalize the first letter
newplaceholder = newplaceholder.charAt(0).toUpperCase() + newplaceholder.slice(1);
        this.field = { 
            name: name,
            disabled:false,
            label: newplaceholder,
            type: type,
            required: false,
            newRow: false,
            placeholder: type === 'select' ? `Select ${newplaceholder}` : `Enter ${newplaceholder}`,
            value: null, 
            options: []
        };

        this.fields.push(this.field);
        return this;
    
    }



    required(){
        this.field.required = true;
        return this;
    }

    disabled() {
        this.field.disabled = true;
        return this;
    }

    value(value:string){
        this.field.value = value;
        return this;
    }

    newRow(){
        this.field.newRow = true;
        return this;
    }

    options(options : Array<any>){
        this.field.options = options;
        return this;
    }

    submiturl(url : string){
        this.form.submiturl = url;
        return this;
    }

    method(method :  "post" | "put"){
        this.form.method = method;
        return this;
    }

    getForm(){
        return this.form;
    }

    

}
