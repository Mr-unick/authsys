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
      <label className="text-[13px] font-bold text-slate-700 ml-0.5">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-slate-400 ml-1 text-[10px] font-medium tracking-tight">(optional)</span>}
      </label>
      <Input
        {...rest}
        ref={ref}
        name={name}
        className="h-11 w-full px-4 border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-50/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-300 bg-white shadow-sm font-medium text-slate-600"
        type={type}
        defaultValue={value}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
});

export default InputComponent;