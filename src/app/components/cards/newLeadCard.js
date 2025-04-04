import { MessageSquare, Bell, Phone, Clock, User } from "lucide-react";
import Link from "next/link";

const NewLeadCard = ({ data }) => {
    const {
        id,
        name,
        number,
        hasReminder,
    } = data;

    return (
        <Link href={`/leads/details/${id}`}>
            <div className="bg-white rounded-lg p-2 flex items-center justify-between my-3   border border-gray-200 hover:border-blue-300">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 flex items-center gap-2">
                            {name}
                        </h3>
                        <div className="flex items-center mt-1 text-gray-500">
                            <Phone className="h-4 w-4 mr-1" />
                            <span className="text-sm">{number}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center">
                    {hasReminder && (
                        <div className="flex items-center bg-amber-100 px-2 py-1 rounded-md">
                            <Bell className="h-4 w-4 text-amber-600 mr-1" />
                            <span className="text-xs font-medium text-amber-600">Reminder</span>
                        </div>
                    )}
                    <div className="ml-2 p-2 rounded-full hover:bg-gray-100">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NewLeadCard;