


import { Trash2, AlertTriangle } from "lucide-react";

export default function ConfirmDelete({ handleDelete, setOpen }) {
    return (
        <div className="flex flex-col gap-5">
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                    <p className="text-sm font-semibold text-red-800">Are you sure?</p>
                    <p className="text-xs text-red-600/80 mt-1">
                        This action cannot be undone. All selected data will be permanently removed.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="flex-1 px-4 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors border border-slate-200"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleDelete()}
                    type="button"
                    className="flex-[1.5] px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        </div>
    );
}
