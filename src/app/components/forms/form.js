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
import { Loader2 } from "lucide-react";

export default function FormComponent({ formdata, id, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setdata] = useState([]);
  const [change, setChange] = useState(false)
  const [res, setRes] = useState(false)
  const [loder, setloder] = useState(false)
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
    setloder(true)
    try {
      if (res.method === "post") {
        const url = id ? `/api/${res.submiturl}?id=${id}` : `/api/${res.submiturl}`;
        let response = await axios.post(url, data, {
          validateStatus: (status) => status >= 200 && status < 500
        });
        if (response.status >= 200 && response.status < 300) {
          toast.success(response.data.message || "Saved successfully");
          if (onSuccess) onSuccess(response.data);
        } else {
          toast.error(response.data.message || "Failed to save");
        }
      } else if (res.method === "put") {
        let response = await axios.put(`/api/${res.submiturl}?id=${id}`, data, {
          validateStatus: (status) => status >= 200 && status < 500
        });
        if (response.status >= 200 && response.status < 300) {
          toast.success(response.data.message || "Updated successfully");
          if (onSuccess) onSuccess(response.data);
        } else {
          toast.error(response.data.message || "Failed to update");
        }
      } else {
        toast.error("Unsupported method");
      }
    } catch (error) {
      console.error("Submission error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Submission failed";
      toast.error(errorMsg);
    } finally {
      setloder(false);
    }
  };


  useEffect(() => {
    handleFetchdata();
  }, []);




  return (

    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`flex flex-col gap-6 max-h-[85vh] overflow-y-auto scrollbar-hide w-full ${data?.fields?.length <= 10 ? "max-w-4xl" : "max-w-[1200px]"}`}
    >
      <div className="mb-1">
        <h1 className="text-xl font-bold text-slate-800">
          {data?.title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Fill in the details below</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-5">
        {data?.fields?.map((field, key) => {
          const gridClasses = field.newRow ? "sm:col-span-4" : "sm:col-span-2";
          const validationRules = field.required
            ? { required: `${field.name} is required` }
            : {};
          // ... select logic remains same but container styling applied ...
          // ... input logic remains same but container styling applied ...
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
                  <p className="text-red-500 text-xs font-medium mt-1.5">
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
                  <p className="text-red-500 text-xs font-medium mt-1.5">
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
          }
        })}
      </div>

      <div className="flex justify-end pt-5 border-t border-slate-100 mt-4">
        <Button
          className="w-full sm:w-auto min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white h-10 rounded-lg transition-colors font-medium text-sm"
          type="submit"
          disabled={loder}
        >
          {
            loder ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : (id ? "Update" : "Save")
          }
        </Button>
      </div>
    </form>
  );
}
