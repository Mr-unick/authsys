

export type ResponseInstance = {
    message: string;
    data: Array<object> | object;
    status: number;
  };

  export type PaginationInstance = {
    page: number;                // Current page number
    perPage: number;             // Items per page
    totalPages: number;          // Total number of pages
    totalRows: number;           // Total number of items
    hasNextPage: boolean;        // true if next page exists
    hasPrevPage: boolean;        // true if previous page exists
    startIndex: number;          // Index of first item on current page
    endIndex: number;            // Index of last item on current page
  };

 export  type TablePropsResponseInstance = {
    name: string;
    title: string;
    update: boolean;
    updateform:object;
    delete: boolean;
    view: boolean;
    create: boolean;
    createform:object
    formtype:string
    rows: Array<object>;
    columns: Array<string>;
    assign: boolean;
    pagination:PaginationInstance | null;
  };

 

  export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'color' | 'switch' | 'checkbox' | 'textarea' | 'date' | "time" | "color";

  export interface InputField {
    name: string;
    type: FieldType;
    label: string;
    value?: string | number | boolean | null;
    placeholder?: string;
    options?: string[] | null;  
    required?: boolean | false;
    newRow ?:boolean | false
    disabled:boolean
}

export type FormInstance = {
  title : string | null,
  fields :Array<InputField>,
  submiturl : string,
  method : string
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
  
  