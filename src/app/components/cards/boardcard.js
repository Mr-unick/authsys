import { MessageSquare, Bell, Phone, Clock, Mail } from "lucide-react";
import DrawerComponent from "../drawer";
import Link from "next/link";
// target="_blank"

const BoardCard = ({ data }) => {
  const {
    id,
    name,
    phone,
    messageCount,
    hasReminder,
    status,
    lastContactTime,
    email
  } = data;

  const isActive = status === true || status === 'active';

  return (
    <Link href={`/leads/details/${id}`}>
      <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 border border-gray-100 group">
        <div className="flex items-start justify-between mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#0F1626] text-sm mb-1 group-hover:text-indigo-600 transition-colors truncate">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-gray-400">
              <Phone size={11} className="shrink-0" />
              <span className="text-[11px] font-medium truncate">{phone || 'No phone'}</span>
            </div>
          </div>
          <span
            className={`
              shrink-0 inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider
              ${isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-400 border border-gray-100"}
            `}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-3 min-w-0">
            {lastContactTime ? (
              <div className="flex items-center gap-1 text-gray-400">
                <Clock size={12} />
                <span className="text-[10px] font-bold truncate">{lastContactTime}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400">
                <Mail size={12} />
                <span className="text-[10px] font-bold truncate">{email || 'No email'}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasReminder && (
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-500">
                <Bell size={12} />
              </div>
            )}
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${messageCount > 0 ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-gray-50 border-gray-100 text-gray-300'}`}>
              <MessageSquare size={11} />
              <span className="text-[10px] font-bold">{messageCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
