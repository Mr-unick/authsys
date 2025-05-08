import { FileUp } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger, DialogClose, DialogFooter
  } from "../../../components/components/ui/dialog"
import ExcelToJsonConverter from "./ExcelConverter";





export default function UploadLeads(){
return (<Dialog>
        <DialogTrigger asChild>
           <button className="flex items-center justify-center gap-2 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-normal rounded-lg "
 > Upload <FileUp size={16} color='white'/></button> 
        </DialogTrigger>
        <DialogContent >
            <ExcelToJsonConverter/>
        </DialogContent>
    </Dialog>
)
  }


