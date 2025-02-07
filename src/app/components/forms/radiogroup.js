import {
  RadioGroup,
  RadioGroupItem,
} from "../../../components/components/ui/radio-group";

export default function RadioGroupComponent({ options ,label ,required,...rest}) {
  return (
    <RadioGroup>

        <label className="text-sm text-gray-500">{ label} { required ? "*" : " (optional)"}</label>

        <div className="flex items-center space-x-3">
         {options.map((option,key) => {
         return <div key={key}>
         <RadioGroupItem {...rest} value={option}/>
         <label className="text-sm ">{option}</label>
         </div>
            })}
          
        </div>
      
    </RadioGroup>
  );
}
