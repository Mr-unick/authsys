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
            <div className="bg-white rounded-xl p-3 flex items-center justify-between my-2 border border-gray-50 hover:border-blue-200 hover:shadow-sm transition-all duration-200 group">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl group-hover:bg-blue-100 transition-colors">
                        <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#0F1626]">
                            {name}
                        </h3>
                        <div className="flex items-center mt-0.5 text-gray-400">
                            <Phone className="h-3 w-3 mr-1.5" />
                            <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">{number}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasReminder && (
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg">
                            <Bell className="h-3 w-3 text-amber-600 mr-1" />
                            <span className="text-[10px] font-bold text-amber-600">Reminder</span>
                        </div>
                    )}
                    <div className="p-2 rounded-lg text-gray-300 group-hover:text-blue-500 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NewLeadCard;