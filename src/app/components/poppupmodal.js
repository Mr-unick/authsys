


import { Delete, Edit, FilePen, Loader2, Plus, Trash, UserPlus, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "../../components/components/ui/dialog"
import ConfirmDelete from "./modals/confirmdelete";
import ConfirmAssign from "./modals/confirmassign";
import { Button } from "../../components/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Addcollborator from "./modals/addcollaborator";

export default function PopupModal({ modaltype, children, classname, data, url, setChange }) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAssign = async (selectedUser) => {
        setLoading(true)
        try {
            let response = await axios.post('/api/leaddetails/assignleads', {
                leads: data,
                salespersons: selectedUser.map(user => user.id)
            })

            if (response.status == 200) {
                setOpen(false)
                toast.success(response.data.message)
            } else {
                toast.error('Leads assigned failed')
            }
            setChange(true)
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setLoading(true)
        try {
            let response = await axios.delete(`/api/${url}`, {
                data: { leads: data },
            })

            if (response.status == 200) {
                toast.success('Deleted successfully')
                setOpen(false)
                setChange(true)
            } else {
                toast.error('Operation failed')
            }
        } catch (error) {
            toast.error('Delete failed')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    const handleaddcollaborators = async (selectedUser) => {
        setLoading(true)
        try {
            let response = await axios.post('/api/leaddetails/addcollaborators', {
                leads: data,
                salespersons: selectedUser?.map(user => user?.id)
            })

            if (response.status == 200) {
                toast.success('Collaborators added successfully')
                setOpen(false)
                setChange(true)
            } else {
                toast.error('Leads assigned failed')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    const getModalTitle = () => {
        switch (modaltype) {
            case 'confirmdelete': return 'Confirm Deletion';
            case 'confirmassign': return 'Assign Leads';
            case 'addcollaborators': return 'Manage Collaborators';
            default: return 'Action';
        }
    }

    const getModalIcon = () => {
        switch (modaltype) {
            case 'confirmdelete': return <Trash className="h-4 w-4 text-red-500" />;
            case 'confirmassign': return <UserPlus className="h-4 w-4 text-indigo-500" />;
            case 'addcollaborators': return <Plus className="h-4 w-4 text-emerald-500" />;
            default: return null;
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className={`${classname} transition-colors active:scale-[0.98]`}
                    onClick={() => setOpen(true)}
                >
                    <span className="text-sm flex items-center gap-2">{children}</span>
                </button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] sm:max-w-[400px] w-[95vw] rounded-xl p-0 overflow-hidden border border-slate-200 bg-white animate-in zoom-in duration-200">
                <DialogHeader className="p-5 pb-0 flex flex-row items-center gap-3 space-y-0">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        {getModalIcon()}
                    </div>
                    <div>
                        <DialogTitle className="text-lg font-bold text-slate-800">{getModalTitle()}</DialogTitle>
                        <p className="text-xs text-slate-400 mt-0.5">Please confirm your action</p>
                    </div>
                </DialogHeader>

                <div className="p-5 pt-3">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                            <p className="text-xs text-slate-400 font-medium">Processing...</p>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            {modaltype === 'confirmdelete' && (
                                <ConfirmDelete setOpen={setOpen} handleDelete={handleDelete} />
                            )}
                            {modaltype === 'confirmassign' && (
                                <ConfirmAssign setOpen={setOpen} handleAssign={handleAssign} />
                            )}
                            {modaltype === 'addcollaborators' && (
                                <Addcollborator setOpen={setOpen} handleaddcollaborators={handleaddcollaborators} />
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
