import { forwardRef } from "react";
import { Textarea } from "../../../components/components/ui/textarea";

const TextAreaComponent = forwardRef(({
  label,
  placeholder,
  name,
  required,
  value,
  rows = 4,
  ...rest
}, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[13px] font-bold text-slate-700 ml-0.5">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-slate-400 ml-1 text-[10px] font-medium tracking-tight">(optional)</span>}
      </label>
      <Textarea
        {...rest}
        ref={ref}
        name={name}
        className="w-full p-4 border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-50/20 focus:border-indigo-500 transition-all text-sm placeholder:text-slate-300 bg-white resize-none shadow-sm font-medium min-h-[100px] text-slate-600"
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
});

export default TextAreaComponent;