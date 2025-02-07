

export type ResponseInstance = {
    message: string;
    data: Array<object> | object;
    status: number;
  };

 export  type TablePropsResponseInstance = {
    name: string;
    title: string;
    update: boolean;
    delete: boolean;
    view: boolean;
    create: boolean;
    rows: Array<object>;
    columns: Array<string>;
  };

 

  export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'switch' | 'checkbox';

  export interface InputField {
    name: string;
    type: FieldType;
    label: string;
    value?: string | number | boolean;
    placeholder?: string;
    options?: string[] | null;  
    required?: boolean | false;
    newRow ?:boolean | false
}

export type FormInstance = {
  title : string | null,
  fields :Array<InputField>,
  submiturl : string
}


export type LeadsTableInstace = {
  name : string ,
  email : string ,
  phone : number,
  second_phone : number,
  address : string,
  collborators : Array< string >,
  headcollborator : string,
  history : Array< Object>,
  nextfollowup : Date,
  lead_source : string,
  status :boolean,
  note : string
}
  
  