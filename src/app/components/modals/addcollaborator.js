import { useState } from "react";
import AutocompleteComponent from "../forms/autocomplete";
import { Loader2 } from "lucide-react";






export default function Addcollborator({ setOpen, handleaddcollaborators }) {

    const [selectedUser, setSelectedUser] = useState([])

    const handleSelectUser = (user) => {
        setSelectedUser([...selectedUser, user])
    };

    const removeSelectUser = (user) => {
        setSelectedUser(selectedUser.filter(userdata=>userdata.id !== user.id))
    };

   // console.log("Selected user:", selectedUser);

    const handleadd = () => {
        handleaddcollaborators(selectedUser)
    };



    return <div className="flex-1 flex flex-col  w-[20rem]  rounded-md justify-between">
        <p className="text-gray-800 my-6 ">
           Add Collaborators
        </p>

        <div className="flex flex-row gap-2 mb-5">
            {
                selectedUser.map((user) => (
                    <div key={user.id} className="flex items-center justify-between bg-blue-600 text-white rounded-md px-2 py-1 w-fit text-sm">
                        <span>@{user.name} <button onClick={(user)=>{removeSelectUser(user)}}>X</button></span>
                    </div>
                ))
            }
        </div>

        <AutocompleteComponent
            apiEndpoint="/api/user/searchuser"
            placeholder="Search..."
          
            renderItem={(user) => (
                <span>{user.username} {user.name} </span>
            )}
            onSelect={handleSelectUser}
        />

        <div className="flex space-x-3  items-center justify-end">
            <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={() => handleadd()}
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Add
            </button>
        </div>
    </div>
}
