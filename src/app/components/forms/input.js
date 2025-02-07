




import { Input } from "../../../components/components/ui/input";


export default function InputComponent({label,type,name,required,...rest}) {
    return <div className="flex flex-col gap-1">
   <label className="text-sm text-gray-500">{ label}{ required ? "*" : " (optional)"}</label>
    <Input {...rest} className="placeholder:text-black border-[1px] border-[#4E49F2]" type={type}  placeholder={label}/>
  </div>
}