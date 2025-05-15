import { ActivityType } from '@/app/entity';
import { 
    MessageSquare, 
    ArrowRightLeft, 
    Edit, 
    Trash2, 
    RefreshCw, 
    LogIn, 
    LogOut, 
    Users 
  } from 'lucide-react';
  

  

  
  const ActivityCard = ({ type, user, timestamp, description }) => {
    // Icon and background color mapping based on activity type
    const getIconAndColor = () => {
      switch (type) {
        case ActivityType.COMMENT:
          return { icon: <MessageSquare className="text-white" size={16} />, bgColor: 'bg-blue-500' };
        case ActivityType.STAGE_CHANGE:
          return { icon: <ArrowRightLeft className="text-white" size={16} />, bgColor: 'bg-purple-500' };
        case ActivityType.EDIT:
          return { icon: <Edit className="text-white" size={16} />, bgColor: 'bg-amber-500' };
        case ActivityType.DELETE:
          return { icon: <Trash2 className="text-white" size={16} />, bgColor: 'bg-red-500' };
        case ActivityType.UPDATE:
          return { icon: <RefreshCw className="text-white" size={16} />, bgColor: 'bg-green-500' };
        case ActivityType.LOGIN:
          return { icon: <LogIn className="text-white" size={16} />, bgColor: 'bg-teal-500' };
        case ActivityType.LOGOUT:
          return { icon: <LogOut className="text-white" size={16} />, bgColor: 'bg-gray-500' };
        case ActivityType.ASSIGN:
          return { icon: <Users className="text-white" size={16} />, bgColor: 'bg-indigo-500' };
        default:
          return { icon: null, bgColor: 'bg-gray-200' };
      }
    };
  
    return (
      <div className="flex items-center gap-3 p-3 bg-white border-b border-gray-100 last:border-0 hover:bg-gray-50">
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getIconAndColor().bgColor}`}>
          {getIconAndColor().icon}
        </div>
        
        <div className="flex-grow">
          <div className="text-sm">
            <span className="font-medium text-gray-900">{user}</span>
            <span className="text-gray-500"> · {type}</span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{description}</p>
        </div>
        
        <div className="text-xs text-gray-400 flex-shrink-0">
          {timestamp}
        </div>
      </div>
    );
  };
  
  // Simple demo component
  export default function ActivityFeed() {
    const activities = [
      {
        type: ActivityType.COMMENT,
        user: "Alex Smith",
        timestamp: "2m ago",
        description: "Added comment on Task-421"
      },
      {
        type: ActivityType.STAGE_CHANGE,
        user: "Maria Garcia",
        timestamp: "1h ago",
        description: "Moved from 'In Progress' to 'Review'"
      },
      {
        type: ActivityType.ASSIGN,
        user: "John Doe",
        timestamp: "3h ago",
        description: "Assigned to Sarah Johnson"
      },
      {
        type: ActivityType.EDIT,
        user: "Alex Smith",
        timestamp: "2m ago",
        description: "Added comment on Task-421"
      },
      {
        type: ActivityType.LOGIN,
        user: "Maria Garcia",
        timestamp: "1h ago",
        description: "Moved from 'In Progress' to 'Review'"
      },
      {
        type: ActivityType.LOGOUT,
        user: "John Doe",
        timestamp: "3h ago",
        description: "Assigned to Sarah Johnson"
      },
      {
        type: ActivityType.DELETE,
        user: "Alex Smith",
        timestamp: "2m ago",
        description: "Added comment on Task-421"
      },
      {
        type: ActivityType.UPDATE,
        user: "Maria Garcia",
        timestamp: "1h ago",
        description: "Moved from 'In Progress' to 'Review'"
      },
      {
        type: ActivityType.COMMENT,
        user: "John Doe",
        timestamp: "3h ago",
        description: "Assigned to Sarah Johnson"
      }
    ];
    
    return (
      <>
       
          {activities.map((activity, index) => (
            <ActivityCard
              key={index}
              type={activity.type}
              user={activity.user}
              timestamp={activity.timestamp}
              description={activity.description}
            />
          ))}
        
      </>
     
    );
  }