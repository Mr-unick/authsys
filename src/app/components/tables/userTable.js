import React from 'react';

const UserTable = ({userData}) => {
  // Sample user data with calculated conversion percentage
  

  return (
    <div className="w-full overflow-y-scroll flex flex-col p-2">
      {userData.map((user) => (
        <a 
          key={user.id} 
          href="#" 
          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-md transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1">
            <img 
              src={user.profileImg} 
              alt={`${user.username}'s profile`} 
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm font-medium">{user.username}</div>
          </div>
          
          <div className="flex-1 text-sm text-gray-600 max-sm:hidden">{user.contact}</div>
          
          <div className="flex justify-end space-x-6 text-sm">
            <div className="text-sm font-medium text-gray-800">{user.assignedLeads}</div>
            <div className="text-sm font-medium text-green-600">{user.conversionPercentage}%</div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default UserTable;