import { useForm } from "react-hook-form";
import { Button } from "../../../components/components/ui/button";
import CheckBoxComponent from "./checkbox";
import SelectComponent from "./select";
import InputComponent from "./input";
import RadioGroupComponent from "./radiogroup";
import SwitchComponent from "./switch";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ROOT_URL } from "../../../../const";
import { toast } from "react-toastify";
import TextAreaComponent from "./textarea";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

export default function FormComponent({ formdata, id, setOpen }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setdata] = useState([]);
  const [change, setChange] = useState(false)
  const [res, setRes] = useState(false)
  const router = useRouter();


  const handleFetchdata = useCallback(() => {
    axios
      .get(`${ROOT_URL}api/forms/${formdata?.formurl}?id=${id}`)
      .then((res) => res.data)
      .then((res) => {
        setdata(res);
        setRes(res);
        
      })
      .catch(error => {
        console.error("Failed to fetch data:", error);
      });
    setChange(false);
  }, [change]);

  const onSubmit = async (data) => {

    if (res.method === "post") {

      let response = await axios.post(`${ROOT_URL}api/${res.submiturl}`, data);
      if (response.status === 200) {
        toast.success(response.data.message);
        router.back();
      } else {
        toast.error(response.data.message);
      }


    } else if (res.method === "put") {

      let response = await axios.post(`${ROOT_URL}api/${res.submiturl}?id=${id}`, data);

      if (response.status === 200) {
        toast.success(response.data.message);
        router.current();
      } else {
        toast.error(response.data.message);

      }

    } else {
      toast.error("Something went wrong");
    }

  };

  useEffect(() => {
    handleFetchdata();
  }, []);




  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col justify-around  px-5 max-sm:px-2 max-sm:max-h-[35rem] overflow-y-scroll max-sm:text-xs  py-2 ${data?.fields?.length <= 10 ? "w-[40rem] max-sm:w-[20rem]" : "w-[60rem]"}`}
    >
      <div>
        <h1 className="mb-6 text-xl max-sm:text-[1rem] font-normal text-gray-700">
          {data?.title}
        </h1>
      </div>
      <div className={`grid  gap-x-8 gap-y-8 max-sm:gap-y-4 ${data?.fields?.length <= 10 ? "grid-cols-2 " : "grid-cols-3"}`}>
        {data?.fields?.map((field, key) => {
          const gridClasses = field.newRow ? "col-span-2" : "max-sm:col-span-2";
          const validationRules = field.required
            ? { required: `${field.name} is required` }
            : {};

          if (field.type === "select") {
            return (
              <div key={key} className={gridClasses}>
                <SelectComponent
                  value={field.value}
                  label={field.label}
                  options={field.options}
                  required={field.required}
                  disabled={field.disabled}
                  {...register(field.name, validationRules)}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            );
          } else if (
            field.type === "text" ||
            field.type === "file" ||
            field.type === "password" ||
            field.type === "email" ||
            field.type === "color" ||
            field.type === "date" ||
            field.type === "time" ||
            field.type === "colour"
          ) {
            return (
              <div key={key} className={gridClasses}>
                <InputComponent
                  value={field.value}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  disabled={field.disabled}
                  {...register(field.name, validationRules)}
                />
                {errors[field?.name] && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors[field?.name]?.message}
                  </p>
                )}
              </div>
            );
          } else if (field.type === "textarea") {
            return (
              <div key={key} className={gridClasses}>
                <TextAreaComponent
                  value={field.value}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
              </div>
            )
          } else if (field.type === "date") {
            return (
              <div key={key} className={gridClasses}>
                <TextAreaComponent
                  value={field.value}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  {...register(field.name, validationRules)}
                />
              </div>
            )
          }
        })}
      </div>

      <div className="flex justify-end w-full mt-8 gap-4 ">
        <Button
          className="w-[8rem] bg-[#4E49F2] hover:bg-[#4E49F2]"
          type="submit"
        // onClick={()=>{onsubmit}}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
