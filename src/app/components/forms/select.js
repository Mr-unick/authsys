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
  const [internalValue, setInternalValue] = useState(value?.toString() || "");

  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(value.toString());
    } else {
      setInternalValue("");
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    setInternalValue(newValue);
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
      <label className="text-xs font-semibold text-slate-600">
        {label}{required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-slate-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <Select
        value={internalValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        {...rest}
      >
        <SelectTrigger onBlur={onBlur} className="h-10 w-full px-3.5 border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors bg-white text-sm font-normal text-slate-700">
          <SelectValue
            className="text-slate-400"
            placeholder={"Select " + label}
          />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-slate-200">
          {options && options.length > 0 ? (
            options.map((option, key) => (
              <SelectItem key={key} value={option.id.toString()} >
                {option.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-sm text-slate-500">No options available</div>
          )}
        </SelectContent>
      </Select>

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
