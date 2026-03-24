import { Switch } from "../../../components/components/ui/switch"

export default function SwitchComponent({ label, ...rest }) {
    return (
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors w-full cursor-pointer">
            <label className="text-sm font-medium text-slate-700 cursor-pointer select-none">{label}</label>
            <Switch {...rest} className="data-[state=checked]:bg-indigo-600 scale-90" />
        </div>
    );
}