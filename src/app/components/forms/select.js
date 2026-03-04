import { forwardRef, useEffect, useState } from "react";
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
  // Use internal state to manage the value for controlled component behavior
  const [internalValue, setInternalValue] = useState(value?.toString() || "");

  // Update internal value if the prop changes
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(value.toString());
    } else {
      setInternalValue("");
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setInternalValue(newValue);

    // Call the onChange handler from react-hook-form with a synthetic event
    if (onChange) {
      onChange({
        target: {
          name,
          value: newValue
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[13px] font-bold text-slate-700 ml-0.5">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : <span className="text-slate-400 ml-1 text-[10px] font-medium tracking-tight">(optional)</span>}
      </label>
      <Select
        value={internalValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        {...rest}
      >
        <SelectTrigger onBlur={onBlur} className="h-11 w-full px-4 border-slate-200 rounded-lg focus:ring-4 focus:ring-indigo-50/20 focus:border-indigo-500 transition-all bg-white text-sm shadow-sm font-medium text-slate-600">
          <SelectValue
            className="text-slate-400"
            placeholder={"Select " + label}
          />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-gray-100 shadow-xl">
          {options && options.length > 0 ? (
            options.map((option, key) => (
              <SelectItem key={key} value={option.id.toString()} >
                {option.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-gray-500">No options available</div>
          )}
        </SelectContent>
      </Select>

      {/* 
        This hidden input is crucial for react-hook-form's register to work properly.
        It holds the actual value and receives the ref, allowing RHF to read 
        the value during validation and submission.
      */}
      <input
        type="hidden"
        name={name}
        value={internalValue}
        ref={ref}
      />
    </div>
  );
});

export default SelectComponent;
