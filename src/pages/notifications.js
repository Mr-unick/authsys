import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, X, Loader2, MessageSquare, UserPlus, Inbox, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import { getRelativeTime } from '@/utils/utility';
import { useRouter } from 'next/router';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/components/ui/card";

const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/notifications/get');
            if (response.data.status === 200) {
                setNotifications(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const response = await axios.post('/api/notifications/markRead', { id });
            if (response.data.status === 200) {
                setNotifications(notifications.map(n => n.id === id ? { ...n, status: 'read' } : n));
            }
        } catch {
            toast.error("Failed to mark as read");
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await axios.post('/api/notifications/markRead', { all: true });
            if (response.data.status === 200) {
                setNotifications(notifications.map(n => ({ ...n, status: 'read' })));
                toast.success("All marked as read");
            }
        } catch {
            toast.error("Failed to mark all as read");
        }
    };

    const getNotificationIcon = (message) => {
        const msg = message.toLowerCase();
        if (msg.includes('mentioned'))
            return <div className="bg-purple-50 p-2 sm:p-2.5 rounded-xl border border-purple-100"><MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" /></div>;
        if (msg.includes('assigned'))
            return <div className="bg-blue-50 p-2 sm:p-2.5 rounded-xl border border-blue-100"><UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /></div>;
        return <div className="bg-indigo-50 p-2 sm:p-2.5 rounded-xl border border-indigo-100"><Bell className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" /></div>;
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Syncing Inbox...</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto py-3 sm:py-4 px-2 sm:px-4 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between gap-3 mb-5 sm:mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0F1626] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200">
                        <Inbox className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F1626] tracking-tight leading-tight">Notifications</h1>
                        <p className="text-xs sm:text-sm font-medium text-gray-400 mt-0.5 hidden sm:block">Manage your real-time alerts and mentions</p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="px-3 sm:px-5 py-2 sm:py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-all border border-indigo-100 flex items-center gap-1.5 shrink-0"
                    >
                        <Check className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Mark All Read</span>
                        <span className="sm:hidden">Read All</span>
                    </button>
                )}
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-gray-50/30 border-b border-gray-100 py-4 px-4 sm:px-6">
                    <CardTitle className="text-sm sm:text-base font-bold text-[#0F1626] flex items-center gap-2">
                        All Messages
                        {unreadCount > 0 && (
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                {unreadCount} NEW
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`group py-4 px-4 sm:py-5 sm:px-6 flex items-start gap-3 sm:gap-5 transition-all duration-300 relative ${notification.status === 'unread' ? 'bg-indigo-50/20' : 'hover:bg-gray-50/50'}`}
                                >
                                    {notification.status === 'unread' && (
                                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-600 rounded-r-full" />
                                    )}
                                    <div className="shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.message)}
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                                        <div
                                            onClick={() => notification.url && router.push(notification.url)}
                                            className={`text-sm leading-relaxed ${notification.url ? 'cursor-pointer hover:text-indigo-600' : ''} ${notification.status === 'unread' ? 'text-[#0F1626] font-semibold' : 'text-gray-600 font-medium'} transition-colors`}
                                        >
                                            {notification.message}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                {getRelativeTime(notification.created_at)}
                                            </span>
                                            {notification.status === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                            {notification.url && (
                                                <button
                                                    onClick={() => router.push(notification.url)}
                                                    className="text-[10px] font-bold text-gray-400 flex items-center gap-1 hover:text-indigo-600 transition-colors"
                                                >
                                                    View <ArrowRight size={10} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="bg-gray-50 p-5 rounded-3xl border-2 border-dashed border-gray-100">
                                    <Bell className="h-10 w-10 opacity-20" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-400">All caught up!</p>
                                    <p className="text-xs font-medium uppercase tracking-widest mt-1">No new notifications</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotificationsTab;
