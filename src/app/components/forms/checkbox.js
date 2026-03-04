import { Checkbox } from "../../../components/components/ui/checkbox";

export default function CheckBoxComponent({ label, name, ...rest }) {
  return (
    <div className="flex flex-col gap-1.5 items-start py-1">
      <div className="flex items-center gap-2.5 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors w-full cursor-pointer">
        <Checkbox {...rest} id={name} className="h-4.5 w-4.5 rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
        <label className="text-[12px] font-bold text-slate-700 cursor-pointer select-none" htmlFor={name}>{label}</label>
      </div>
    </div>
  );
}
