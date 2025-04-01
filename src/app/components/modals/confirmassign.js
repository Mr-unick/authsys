





export default function ConfirmAssign({ itemName }) {
    return <div className="flex-1 flex flex-col justify-center items-center p-2 text-center">
        <p className="text-gray-800 mb-4 mt-4">
            Are you sure you want to assign {itemName}?
        </p>

        <div className="flex space-x-3 mt-4 w-full justify-end">
            <button
                // onClick={onCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
                Cancel
            </button>
            <button
                // onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
                Delete
            </button>
        </div>
    </div>
}
