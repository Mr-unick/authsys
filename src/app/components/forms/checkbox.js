import { Checkbox } from "../../../components/components/ui/checkbox";

export default function CheckBoxComponent({ label, name, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5 items-start py-0.5">
      <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors w-full cursor-pointer">
        <Checkbox {...rest} id={name} className="h-4 w-4 rounded border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
        <label className="text-sm font-medium text-slate-700 cursor-pointer select-none" htmlFor={name}>{label}</label>
      </div>
    </div>
  );
}
