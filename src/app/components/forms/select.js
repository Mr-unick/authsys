import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";

export default function SelectComponent({label,options,required,...rest}) {
    
  return (
    <div className="flex flex-col gap-1">
     <label className="text-sm text-gray-500">{ label}{ required ? "*" : " (optional)"}</label>   
    <Select {...rest} className=''>
      <SelectTrigger>
        <SelectValue className='text-gray-400 ' placeholder={"Select" + " " + label} />
      </SelectTrigger>
      <SelectContent className="">
        {options.map((option,key) => {
          return <SelectItem key={key} value={option}>{option}</SelectItem>;
        })}
      </SelectContent>
    </Select>

    </div>
  );
}
