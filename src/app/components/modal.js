import { Delete, Edit, FilePen, Plus ,Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"
import { Button } from "../../components/components/ui/button";

export default function Modal({ children, title, icon ,classname , customebutton}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {
          customebutton ? customebutton :   <Button className={`max-md:block flex items-center gap-2 ${classname}`}>
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
      <DialogContent className="max-h-fit max-w-fit rounded-md max-sm:p-3">
        {children}
      </DialogContent>
    </Dialog>
  );
}