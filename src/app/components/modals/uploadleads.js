import { FileUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger, DialogClose, DialogFooter
} from "../../../components/components/ui/dialog"
import ExcelToJsonConverter from "./ExcelConverter";





export default function UploadLeads() {
  return (<Dialog>
    <DialogTrigger asChild>
      <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 transition-all hover:scale-[1.02] active:scale-95"
      > <p className="max-md:hidden">Upload</p> <FileUp size={16} /></button>
    </DialogTrigger>
    <DialogContent className="max-w-xl rounded-[2.5rem] p-6 border-none shadow-2xl overflow-hidden">
      <ExcelToJsonConverter />
    </DialogContent>
  </Dialog>
  )
}


