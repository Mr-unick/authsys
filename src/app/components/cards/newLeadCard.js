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
            <div className="bg-white rounded-lg p-3 flex items-center justify-between border border-slate-100 hover:border-slate-200 transition-colors duration-200 group">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 group-hover:bg-blue-100 transition-colors">
                        <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-slate-700">
                            {name}
                        </h3>
                        <div className="flex items-center mt-0.5 text-slate-400">
                            <Phone className="h-3 w-3 mr-1.5" />
                            <span className="text-xs font-medium">{number}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasReminder && (
                        <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            <Bell className="h-3 w-3 text-amber-600 mr-1" />
                            <span className="text-xs font-medium text-amber-600">Reminder</span>
                        </div>
                    )}
                    <div className="p-1.5 rounded-md text-slate-300 group-hover:text-blue-500 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NewLeadCard;