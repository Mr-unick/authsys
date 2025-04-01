import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'New message received',
            message: 'John Doe sent you a message',
            time: '5 minutes ago',
            read: false,
            type: 'message'
        },
        {
            id: 2,
            title: 'System update',
            message: 'Your system has been updated successfully',
            time: '1 hour ago',
            read: false,
            type: 'system'
        },
        {
            id: 3,
            title: 'Reminder',
            message: 'Meeting with the team at 2:00 PM',
            time: '3 hours ago',
            read: true,
            type: 'reminder'
        },
        {
            id: 4,
            title: 'New connection',
            message: 'Jane Smith accepted your connection request',
            time: 'Yesterday',
            read: true,
            type: 'social'
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    const removeNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'message':
                return <div className="bg-blue-100 p-2 rounded-full"><Bell className="h-5 w-5 text-blue-500" /></div>;
            case 'system':
                return <div className="bg-green-100 p-2 rounded-full"><Bell className="h-5 w-5 text-green-500" /></div>;
            case 'reminder':
                return <div className="bg-yellow-100 p-2 rounded-full"><Bell className="h-5 w-5 text-yellow-500" /></div>;
            case 'social':
                return <div className="bg-purple-100 p-2 rounded-full"><Bell className="h-5 w-5 text-purple-500" /></div>;
            default:
                return <div className="bg-gray-100 p-2 rounded-full"><Bell className="h-5 w-5 text-gray-500" /></div>;
        }
    };

    const unreadCount = notifications.filter(notification => !notification.read).length;

    return (
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-200">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`py-4 flex items-start ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                            <div className="mr-4">
                                {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <h3 className={`font-medium ${!notification.read ? 'text-blue-800' : 'text-gray-800'}`}>
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-500">
                                        {notification.time}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                </p>
                            </div>
                            <div className="ml-2 flex space-x-1">
                                {!notification.read && (
                                    <button
                                        onClick={() => markAsRead(notification.id)}
                                        className="p-1 rounded-full hover:bg-gray-200"
                                        title="Mark as read"
                                    >
                                        <Check className="h-4 w-4 text-gray-500" />
                                    </button>
                                )}
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="p-1 rounded-full hover:bg-gray-200"
                                    title="Remove notification"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-6 text-center text-gray-500">
                        No notifications to display
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsTab;