import { Delete, Edit, FilePen, Plus, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"
import { Button } from "../../components/components/ui/button";
import { useState } from "react";

export default function Modal({ children, title, icon, classname, customebutton, open: controlledOpen, onOpenChange: setControlledOpen }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? setControlledOpen : setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {
          customebutton ? customebutton : <Button className={`max-md:block flex items-center gap-2 ${classname}`}>
            <p className="max-md:hidden">
              {title}
            </p>
            {
              icon == 'Add' && <Plus size={22} />
            }

            {
              icon == 'Delete' && <Trash size={22} />
            }

            {
              icon == 'Edit' && <FilePen size={22} />
            }
            {
              icon == 'Export' && <Edit size={22} />
            }
          </Button>
        }

      </DialogTrigger>
      <DialogContent className="max-h-[90vh] sm:max-w-[45vw] w-[95vw] rounded-[1.5rem] p-6 sm:p-8 overflow-y-auto scrollbar-hide border-none shadow-2xl">
        {children}
      </DialogContent>
    </Dialog>
  );
}