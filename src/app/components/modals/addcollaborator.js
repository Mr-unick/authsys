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
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 rounded-xl bg-gray-50/50 border border-dashed border-gray-200">
                    {selectedUser.length > 0 ? (
                        selectedUser.map((user) => (
                            <div key={user.id} className="flex items-center gap-1.5 bg-white border border-emerald-100 text-[#0F1626] rounded-lg px-2 py-1 shadow-sm animate-in zoom-in duration-300">
                                <span className="text-[11px] font-bold">@{user.name}</span>
                                <button
                                    onClick={() => removeSelectUser(user)}
                                    className="p-0.5 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-gray-400 italic px-2 py-1">No collaborators selected...</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Search Collaborators</label>
                    <AutocompleteComponent
                        apiEndpoint="/api/user/searchuser"
                        placeholder="Type name or username..."
                        renderItem={(user) => (
                            <div className="flex items-center justify-between w-full px-1">
                                <span className="text-xs font-medium">{user.name} <span className="text-gray-400 font-normal">(@{user.username})</span></span>
                                {selectedUser.find(u => u.id === user.id) && <Check size={12} className="text-emerald-600" />}
                            </div>
                        )}
                        onSelect={handleSelectUser}
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                <button
                    onClick={() => setOpen(false)}
                    type="button"
                    className="flex-1 px-4 py-3 bg-white text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all border border-gray-100"
                >
                    Cancel
                </button>
                <button
                    onClick={handleadd}
                    disabled={selectedUser.length === 0}
                    type="button"
                    className="flex-[1.5] px-4 py-3 bg-[#0F1626] disabled:opacity-50 disabled:grayscale text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                >
                    <UserPlus size={14} /> Add
                </button>
            </div>
        </div>
    );
}
