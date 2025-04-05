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
    lastContactTime, email
  } = data;
  return (
    <Link href={`/leads/details/${id}`} >
      <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-all duration-200 border-[1px] border-gray-200">
        <div className="flex items-start justify-between mb-3 ">
          <div>
            <h3 className="font-medium text-gray-900 mb-2 text-start ">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={14} />
              <span className="text-sm">{phone}</span>
            </div>
          </div>
          <span
            className={`
    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold
    ${status  ? "bg-green-500 text-white" : "bg-red-500 text-white"}
  `}
          >
            {status ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Footer with messages, time and reminder */}

        <div className="flex items-center justify-between  mt-3">
          <div className="flex items-center gap-3 w-[100%]  justify-between">
            {
              lastContactTime ? <div className="flex items-center gap-1.5 text-gray-500">
                <Clock size={14} />
                <span className="text-xs">{lastContactTime}</span>
              </div> : <div className="flex items-center gap-1.5 text-gray-500">
                <Mail size={14} />
                  <span className="text-xs">{email}</span>
              </div>
            }
           

            {hasReminder ? (
              <Bell size={16} className="text-blue-500" />
            ) : (
              <div className="flex items-center gap-1 text-gray-600">
                <MessageSquare size={16} />
                <span className="text-sm font-medium">{messageCount}</span>
              </div>
            )}
          </div>
          {/* 
          {hasReminder && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
              <Bell size={16} className="text-blue-500" />
            </div>
          )} */}
        </div>
      </div>
    </Link>
  );
};

export default BoardCard;
