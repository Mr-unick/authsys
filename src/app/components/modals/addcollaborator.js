import { useState } from "react";
import AutocompleteComponent from "../forms/autocomplete";
import { UserPlus, X, Check } from "lucide-react";

export default function Addcollborator({ setOpen, handleaddcollaborators }) {
    const [selectedUser, setSelectedUser] = useState([])

    const handleSelectUser = (user) => {
        if (!selectedUser.find(u => u.id === user.id)) {
            setSelectedUser([...selectedUser, user])
        }
    };

    const removeSelectUser = (user) => {
        setSelectedUser(selectedUser.filter(userdata => userdata.id !== user.id))
    };

    const handleadd = () => {
        handleaddcollaborators(selectedUser)
    };

    return (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-200">
                    {selectedUser.length > 0 ? (
                        selectedUser.map((user) => (
                            <div key={user.id} className="flex items-center gap-1.5 bg-white border border-emerald-100 text-slate-700 rounded-md px-2 py-1 animate-in zoom-in duration-200">
                                <span className="text-xs font-medium">@{user.name}</span>
                                <button
                                    onClick={() => removeSelectUser(user)}
                                    className="p-0.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-slate-400 px-1 py-0.5">No collaborators selected...</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Search Collaborators</label>
                    <AutocompleteComponent
                        apiEndpoint="/api/user/searchuser"
                        placeholder="Type name or username..."
                        renderItem={(user) => (
                            <div className="flex items-center justify-between w-full px-1">
                                <span className="text-sm font-medium text-slate-700">{user.name} <span className="text-slate-400 font-normal">(@{user.username})</span></span>
                                {selectedUser.find(u => u.id === user.id) && <Check size={12} className="text-emerald-600" />}
                            </div>
                        )}
                        onSelect={handleSelectUser}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="flex-1 px-4 py-2.5 bg-white text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors border border-slate-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleadd}
                    disabled={selectedUser.length === 0}
                    type="button"
                    className="flex-[1.5] px-4 py-2.5 bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                    <UserPlus size={14} /> Add Collaborators
                </button>
            </div>
        </div>
    );
}
