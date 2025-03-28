import { forwardRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/components/ui/select";

const SelectComponent = forwardRef(({
  label,
  options,
  required,
  value,
  onChange,
  onBlur,
  disabled,
  name,
  ...rest
}, ref) => {
  // Check if options are objects or simple strings
  const isOptionObject = options.length > 0 && typeof options[0] === 'object';
  
  // This is the key change - we need to register the onChange event with React Hook Form
  const handleValueChange = (newValue) => {
    // Create a synthetic event object that react-hook-form expects
    const syntheticEvent = {
      target: {
        name,
        value: newValue
      }
    };
    
    // Call the onChange handler from react-hook-form
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500">
        {label}{required ? "*" : " (optional)"}
      </label>
      <Select 
        defaultValue={value || ""} 
        onValueChange={handleValueChange}
        name={name}
        disabled={disabled}
        {...rest}
      >
        <SelectTrigger ref={ref} onBlur={onBlur}>
          <SelectValue 
            className="text-gray-400" 
            placeholder={"Select "+ label} 
          />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, key) => {
           
              return (
                <SelectItem key={key} value={option.id.toString()} >
                  {option.name}
                </SelectItem>
              )
          })}
        </SelectContent>
      </Select>
    </div>
  );
});

export default SelectComponent;