import { Delete, Edit, FilePen, Plus, Trash, FileUp, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "../../components/components/ui/dialog"
import { Button } from "../../components/components/ui/button";
import { useState } from "react";

export default function Modal({ children, title, icon, classname, customebutton, open: controlledOpen, onOpenChange: setControlledOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? setControlledOpen : setInternalOpen;

  const getIcon = () => {
    switch (icon) {
      case 'Add': return <Plus size={18} />;
      case 'Delete': return <Trash size={18} />;
      case 'Edit': return <FilePen size={18} />;
      case 'Export': return <Download size={18} />;
      case 'Upload': return <FileUp size={18} />;
      default: return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {
          customebutton ? customebutton : (
            <Button className={`flex items-center gap-2 rounded-xl transition-all active:scale-95 shadow-sm ${classname}`}>
              <span className="max-md:hidden font-bold">
                {title}
              </span>
              {getIcon()}
            </Button>
          )
        }
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] sm:max-w-[45vw] w-[95vw] rounded-[2.5rem] p-8 overflow-y-auto scrollbar-hide border-none shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}