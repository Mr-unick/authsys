





export default function ConfirmDelete({ handleDelete , setOpen}) {

    return <div className="flex-1 flex flex-col  w-[20rem]  rounded-md justify-between">
        <p className="text-gray-800 my-8 ">
            Are you sure you want to delete? 
        </p>

        <div className="flex space-x-3  items-center justify-end">
            <button
                onClick={() => setOpen(false)}
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={() => handleDelete()}
                type="button"
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Delete
            </button>
        </div>
    </div>
}
