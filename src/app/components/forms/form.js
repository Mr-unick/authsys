import { useForm } from "react-hook-form";
import { Button } from "../../../components/components/ui/button";
import CheckBoxComponent from "./checkbox";
import SelectComponent from "./select";
import InputComponent from "./input";
import RadioGroupComponent from "./radiogroup";
import SwitchComponent from "./switch";
import { useEffect, useState } from "react";
import axios from "axios";
import { ROOT_URL } from "../../../../const";

export default function FormComponent({url}) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const [data ,setdata]=useState(null);

  
  let data2 = [
    {
      name: "gender",
      type: "select",
      label: "Gender",
      options: ["Male", "Female", "Other"],
      value: "Male",
      required: false, 
    },
    {
      name: "name",
      type: "text",
      label: "Enter Name",
      value: "",
      required: false,  
    },
    {
      name: "email",
      type: "email",
      label: "Enter Email",
      value: "",
      required: false, 
    },
    {
      name: "image",
      type: "file",
      label: "Select Profile",
      value: "",
      required: false, 
    },
    {
      name: "password",
      type: "password",
      label: "Enter Password",
      value: "",
      required: false, 
    },
    {
      name: "confirm password",
      type: "password",
      label: "Confirm Password",
      value: "",
      required: false,  
    },
    {
      name: "address",
      type: "text",
      label: "Enter your address",
      value: "",
      required: false, 
    },
    {
      name: "gender",
      type: "radiogroup",
      label: "Select Gender",
      options: ["Male", "Female", "Other"],
      required: false, 
    },
    {
      name: "adhar",
      type: "file",
      label: "Upload Adhar",
      value: "",
      required: false, 
    },
   
    {
      name: "agrred",
      type: "checkbox",
      label: "Agree to terms and conditions",
      value: "",
      required: false,  
      newRow: true,
      
    }
    
  ];

  const handleFetchData =()=>{
    axios.post(`${ROOT_URL}api/${'getBuisnessProps'}?type=getform`).then((res)=>{
     setdata( res.data.data)

     console.log(res.data,'this is fetched data')
    })
  }

  const onSubmit = async (data) => {
    console.log(data); 
    alert('Form submitted successfully!');
  };

  // useEffect(()=>{
  //   handleFetchData();
  // },[])


 
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-around w-[40rem] px-5 py-2">
      <div>
        <h1 className="mb-5 text-xl font-normal text-gray-700">Hello</h1>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-8">
        {data2.map((field, key) => {
          const gridClasses = field.newRow ? 'col-span-2' : '';
          const validationRules = field.required ? { required: `${field.name} is required` } : {};

          if (field.type === "select") {
            return (
              <div key={key} className={gridClasses}>
                <SelectComponent
                  label={field.label}
                  options={field.options}
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
                {errors[field.name] && <p className="text-red-500 text-xs mt-2">{errors[field.name]?.message}</p>}
              </div>
            );
          } else if (field.type === "checkbox") {
            return (
              <div key={key} className={gridClasses}>
                <CheckBoxComponent
                  name={field.name}
                  label={field.label}
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
                {errors[field.name] && <p className="text-red-500 text-xs mt-2">{errors[field.name]?.message}</p>}
              </div>
            );
          } else if (field.type === "text" || field.type === "file" || field.type === "password" || field.type === "email") {
            return (
              <div key={key} className={gridClasses}>
                <InputComponent
                  type={field.type}
                  label={field.label}
                 
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
                {errors[field?.name] && <p className="text-red-500 text-xs mt-2">{errors[field?.name]?.message}</p>}
              </div>
            );
          } else if (field.type === "radiogroup") {
            return (
              <div key={key} className={gridClasses}>
                <RadioGroupComponent
                  label={field.label}
                  options={field.options}
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
                {errors[field.name] && <p className="text-red-500 text-xs mt-2">{errors[field.name]?.message}</p>}
              </div>
            );
          } else if (field.type === "switch"){

            <div key={key} className={gridClasses}>
                <SwitchComponent
                  label={field.label}
                  {...register(field.name, validationRules)}
                />
                {errors[field.name] && <p className="text-red-500 text-xs mt-2">{errors[field.name]?.message}</p>}
            </div>

          }
        })}

      </div>

      <div className="flex justify-end w-full mt-4 ">
        <Button className="w-[8rem] bg-[#4E49F2] hover:bg-[#4E49F2]" type="submit">Submit</Button>
      </div>
    </form>
  );
}
