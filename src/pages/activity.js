


import React, { useState } from 'react';
import { Calendar, User, FileText, MessageSquare, Clock } from 'lucide-react';

const ActivityTab = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activities, setActivities] = useState([
        {
            id: 1,
            user: {
                name: 'John Doe',
                avatar: 'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg'
            },
            action: 'created a new document',
            target: 'Annual Report 2025',
            timestamp: '10 minutes ago',
            type: 'document'
        },
        {
            id: 2,
            user: {
                name: 'Jane Smith',
                avatar: 'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg'
            },
            action: 'commented on',
            target: 'Project Timeline',
            timestamp: '1 hour ago',
            type: 'comment'
        },
        {
            id: 3,
            user: {
                name: 'Robert Johnson',
                avatar: 'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg'
            },
            action: 'scheduled a meeting with',
            target: 'Marketing Team',
            timestamp: '3 hours ago',
            type: 'meeting'
        },
        {
            id: 4,
            user: {
                name: 'Lisa Anderson',
                avatar: 'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg'
            },
            action: 'updated profile information',
            target: '',
            timestamp: 'Yesterday',
            type: 'profile'
        },
        {
            id: 5,
            user: {
                name: 'Michael Brown',
                avatar: 'https://images.pexels.com/photos/7552374/pexels-photo-7552374.jpeg'
            },
            action: 'shared a document with you',
            target: 'Q1 Financial Report',
            timestamp: '2 days ago',
            type: 'document'
        }
    ]);

    const filters = [
        { value: 'all', label: 'All' },
        { value: 'document', label: 'Leads' },
        { value: 'comment', label: 'Comments' },
        { value: 'profile', label: 'Profile' }
    ];

    const filteredActivities = selectedFilter === 'all'
        ? activities
        : activities.filter(activity => activity.type === selectedFilter);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'document':
                return <FileText className="h-5 w-5 text-blue-500" />;
            case 'comment':
                return <MessageSquare className="h-5 w-5 text-green-500" />;
            case 'meeting':
                return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'profile':
                return <User className="h-5 w-5 text-orange-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg  px-4 py-4 max-w-screen ">
            <div className="mb-4">
               
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    {filters.map(filter => (
                        <button
                            key={filter.value}
                            onClick={() => setSelectedFilter(filter.value)}
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${selectedFilter === filter.value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {filteredActivities.length > 0 ? (
                    filteredActivities.map(activity => (
                        <div key={activity.id} className="py-4 flex">
                            <div className="mr-4">
                                <div className="relative">
                                    <img
                                        src={activity.user.avatar}
                                        alt={activity.user.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="text-sm">
                                    <span className="font-medium text-gray-900">{activity.user.name}</span>
                                    <span className="text-gray-700"> {activity.action} </span>
                                    {activity.target && (
                                        <span className="font-medium text-gray-900">{activity.target}</span>
                                    )}
                                </div>
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {activity.timestamp}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-gray-500">
                        No activities to display
                    </div>
                )}
            </div>

            {filteredActivities.length > 5 && (
                <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View more
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;
