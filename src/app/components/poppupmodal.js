

import { Delete, Edit, FilePen, Loader2, Plus, Trash, UserPlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger, DialogClose, DialogFooter
} from "../../components/components/ui/dialog"
import ConfirmDelete from "./modals/confirmdelete";
import ConfirmAssign from "./modals/confirmassign";
import { Button } from "../../components/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function PopupModal({ modaltype ,children ,classname ,data}) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAssign =async (selectedUser) => {
      setLoading(true)
      let response = await axios.post('/api/leaddetails/assignleads',{
            leads : data,
            salespersons : selectedUser.map(user => user.id)
        })
       
      if(response.status == 200){
        setOpen(false)
        toast.success('Leads assigned successfully')
      }else{
        toast.error('Leads assigned failed')
      }
      setLoading(false)
    }

    const handleDelete = async (selectedUser) => {
        setLoading(true)
        console.log("Selected user:",data);
        setLoading(false)
      //  setOpen(false)
    }

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

               {loading ?
                <div className="flex  w-[20rem] min-h-[15rem] items-center justify-center h-full">
                    <Loader2 className="animate-spin" />
                </div> : <>
                        {
                            modaltype == 'confirmdelete' ? <ConfirmDelete itemName={'ss'} setOpen={setOpen} handleDelete={handleDelete} /> :
                                modaltype == 'confirmassign' && <ConfirmAssign itemName={'ss'} setOpen={setOpen} handleAssign={handleAssign} />
                        }
                </>
                 }
    
            

                

            </DialogContent>
        </Dialog>
    );
}