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
      <label className="text-sm font-semibold text-gray-700">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-gray-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <Textarea
        {...rest}
        ref={ref}
        name={name}
        className="w-full p-4 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 transition-all text-sm placeholder:text-gray-400 bg-white resize-none shadow-sm font-medium min-h-[100px]"
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
});

export default TextAreaComponent;