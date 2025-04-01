

import { Delete, Edit, FilePen, Plus, Trash, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"
import ConfirmDelete from "./modals/confirmdelete";
import ConfirmAssign from "./modals/confirmassign";
import { Button } from "../../components/components/ui/button";

export default function PopupModal({ modaltype ,children ,classname}) {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={classname}
                >
                    <span className="text-sm flex items-center gap-2">{children}</span>
                </Button>

            </DialogTrigger>
            <DialogContent className="max-h-fit max-w-fit rounded-md ">

                {
                    modaltype == 'confirmdelete' ? <ConfirmDelete itemName={'ss'} /> :
                        modaltype == 'confirmassign' && <ConfirmAssign itemName={'ss'} />

                }


            </DialogContent>
        </Dialog>
    );
}