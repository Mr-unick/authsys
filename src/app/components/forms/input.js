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
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-gray-700">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <Input
        {...rest}
        ref={ref}
        name={name}
        className="h-11 w-full px-4 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-400 bg-white shadow-sm font-medium"
        type={type}
        defaultValue={value}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
});

export default InputComponent;