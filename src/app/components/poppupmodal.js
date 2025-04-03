

import { Delete, Edit, FilePen, Plus, Trash, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"
import ConfirmDelete from "./modals/confirmdelete";
import ConfirmAssign from "./modals/confirmassign";
import { Button } from "../../components/components/ui/button";
import { useState } from "react";

export default function PopupModal({ modaltype ,children ,classname}) {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={classname}
                    onClick={() => setOpen(true)}
                >
                    <span className="text-sm flex items-center gap-2">{children}</span>
                </Button>

            </DialogTrigger>
            <DialogContent className="max-h-fit max-w-fit rounded-md ">

                {
                    modaltype == 'confirmdelete' ? <ConfirmDelete itemName={'ss'} setOpen={setOpen} /> :
                        modaltype == 'confirmassign' && <ConfirmAssign itemName={'ss'} setOpen={setOpen} />

                }


            </DialogContent>
        </Dialog>
    );
}