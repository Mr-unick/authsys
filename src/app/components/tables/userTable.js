import React from 'react';

const UserTable = ({ userData }) => {
  // Sample user data with calculated conversion percentage


  return (
    <div className="w-full h-full flex flex-col">
      {/* Table Header */}
      <div className="flex items-center px-6 py-3 bg-gray-50/50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <div className="flex-1">Sales Person</div>
        <div className="flex-1 max-sm:hidden">Contact</div>
        <div className="w-20 text-right">Assigned</div>
        <div className="w-20 text-right">Conv %</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto">
        {userData?.map((user) => (
          <div
            key={user.id}
            className="flex items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/80 transition-colors group cursor-default"
          >
            <div className="flex items-center space-x-3 flex-1">
              <img
                src={user.profileImg}
                alt={`${user.username}'s profile`}
                className="w-9 h-9 rounded-full border border-gray-100 shadow-sm object-cover"
              />
              <div className="text-sm font-semibold text-[#0F1626]">{user.username}</div>
            </div>

            <div className="flex-1 text-sm text-gray-500 max-sm:hidden truncate pr-4">{user.contact}</div>

            <div className="w-20 text-right text-sm font-bold text-gray-700">{user.assignedLeads}</div>
            <div className="w-20 text-right text-sm font-bold text-green-600">{user.conversionPercentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;