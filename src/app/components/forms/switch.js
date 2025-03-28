import { Switch } from "../../../components/components/ui/switch"



export default function SwitchComponent({label ,...rest}){
    return <div className="flex gap-2 items-center">
       
        <Switch {...rest} aria-setsize={12}/>  <label>{label}</label>
    </div>
}