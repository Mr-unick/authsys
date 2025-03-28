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
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-500">
        {label}{required ? "*" : " (optional)"}
      </label>
      <Textarea
        {...rest}
        ref={ref}
        name={name}
        className="placeholder:text-gray-600 placeholder:text-xs border-[1px] border-gray-300 resize-none"
        defaultValue={value}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
});

export default TextAreaComponent;