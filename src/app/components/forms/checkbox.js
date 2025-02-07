import { Checkbox } from "../../../components/components/ui/checkbox";

export default function CheckBoxComponent({ label, name, ...rest }) {
  return (
    <div className="flex flex-col gap-1 items-start justify-end">
      <div className="flex items-center gap-2">
        <Checkbox {...rest} id={name} />
        <label className="text-sm " htmlFor={name}>{label}</label>
      </div>
    </div>
  );
}
