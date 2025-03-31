import { forwardRef } from "react";
import { Input } from "../../../components/components/ui/input";

const InputComponent = forwardRef(({
  label,
  placeholder,
  type,
  name,
  required,
  value, disabled,
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm max-sm:text-xs text-gray-500">
        {label}{required ? <span className="text-red-500">*</span> : <span className="text-gray-400 ml-1 text-xs"> (optional)</span>}
      </label>
      <Input 
        {...rest}
        ref={ref}
        name={name}
        className="placeholder:text-gray-600 max-sm:text-xs border-[1px] border-gray-300 " 
        type={type} 
        defaultValue={value}
        disabled={disabled}
    
        placeholder={placeholder}
      />
    </div>
  );
});

export default InputComponent;