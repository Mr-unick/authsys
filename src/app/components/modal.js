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
      case 'Add': return <Plus size={16} />;
      case 'Delete': return <Trash size={16} />;
      case 'Edit': return <FilePen size={16} />;
      case 'Export': return <Download size={16} />;
      case 'Upload': return <FileUp size={16} />;
      default: return null;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {
          customebutton ? customebutton : (
            <Button className={`flex items-center gap-2 rounded-lg transition-colors active:scale-[0.98] ${classname}`}>
              <span className="max-md:hidden font-medium">
                {title}
              </span>
              {getIcon()}
            </Button>
          )
        }
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] sm:max-w-[45vw] w-[95vw] rounded-xl p-6 overflow-y-auto scrollbar-hide border border-slate-200 animate-in zoom-in-95 duration-200">
        <div className="relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}