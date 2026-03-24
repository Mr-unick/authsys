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
      <label className="text-xs font-semibold text-slate-600">
        {label}{required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-slate-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <Textarea
        {...rest}
        ref={ref}
        name={name}
        className="w-full p-3.5 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-sm placeholder:text-slate-400 bg-white resize-none font-normal min-h-[100px] text-slate-700"
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
});

export default TextAreaComponent;