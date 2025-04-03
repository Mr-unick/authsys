import AutocompleteComponent from "../forms/autocomplete";






export default function ConfirmAssign({ itemName }) {


    const handleSelectUser = (user) => {
        console.log("Selected user:", user);
    };



    return <div className="flex-1 flex flex-col  w-[20rem]  rounded-md justify-between">
        <p className="text-gray-800 my-6 ">
            Assign Selected leads to?
        </p>

        <AutocompleteComponent
            apiEndpoint="/api/user/searchuser"
            placeholder="Search..."
            // extractQuery={(input) => {
            //     const lastWord = input.split(" ").pop();
            //     return lastWord?.startsWith("@") ? lastWord.slice(1) : "";
            // }}
            renderItem={(user) => (
                <span>@{user.username} ({user.name})</span>
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
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
               Assign
            </button>
        </div>
    </div>
}
