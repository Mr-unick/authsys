


import { Trash2, AlertTriangle } from "lucide-react";

export default function ConfirmDelete({ handleDelete, setOpen }) {
    return (
        <div className="flex flex-col gap-6 scale-in-center">
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                    <p className="text-sm font-bold text-red-900">Are you sure?</p>
                    <p className="text-xs text-red-700 opacity-80 mt-1">
                        This action cannot be undone. All selected data will be permanently removed.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="flex-1 px-4 py-3 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                >
                    Cancel
                </button>
                <button
                    onClick={() => handleDelete()}
                    type="button"
                    className="flex-[1.5] px-4 py-3 bg-[#0F1626] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                >
                    <Trash2 size={14} /> Confirm Delete
                </button>
            </div>
        </div>
    );
}
