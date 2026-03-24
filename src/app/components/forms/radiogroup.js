import {
  RadioGroup,
  RadioGroupItem,
} from "../../../components/components/ui/radio-group";

export default function RadioGroupComponent({ options, label, required, ...rest }) {
  return (
    <RadioGroup>
      <label className="text-xs font-semibold text-slate-600">
        {label}{required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-slate-400 ml-1 text-xs font-normal">(optional)</span>}
      </label>
      <div className="flex items-center space-x-3 mt-1.5">
        {options.map((option, key) => {
          return (
            <div key={key} className="flex items-center gap-2">
              <RadioGroupItem {...rest} value={option} />
              <label className="text-sm font-medium text-slate-700">{option}</label>
            </div>
          );
        })}
      </div>
    </RadioGroup>
  );
}
