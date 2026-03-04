import { Switch } from "../../../components/components/ui/switch"



export default function SwitchComponent({ label, ...rest }) {
    return (
        <div className="flex items-center justify-between gap-4 bg-slate-50/50 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors w-full cursor-pointer">
            <label className="text-[12px] font-bold text-slate-700 cursor-pointer select-none">{label}</label>
            <Switch {...rest} className="data-[state=checked]:bg-indigo-600 scale-90" />
        </div>
    );
}