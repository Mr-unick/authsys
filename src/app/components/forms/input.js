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
      <label className="text-xs font-semibold text-slate-600">
        {label}{required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-slate-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <Input
        {...rest}
        ref={ref}
        name={name}
        className="h-10 w-full px-3.5 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-sm placeholder:text-slate-400 bg-white font-normal text-slate-700"
        type={type}
        defaultValue={value}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
});

export default InputComponent;