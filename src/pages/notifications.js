import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Check, CheckCheck, Loader2, Trash2, Clock, AlertCircle, Info, X } from "lucide-react";
import { toast } from 'react-toastify';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/notifications/get');
            if (res.data?.data) {
                setNotifications(res.data.data);
            }
        } catch (err) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.patch(`/api/notifications/markread`, { id });
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, status: 'read' } : n)
            );
        } catch (err) {
            toast.error('Failed to update notification');
        }
    };

    const markAllRead = async () => {
        try {
            await axios.patch(`/api/notifications/markread`, { all: true });
            setNotifications(prev =>
                prev.map(n => ({ ...n, status: 'read' }))
            );
            toast.success('All notifications marked as read');
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-400 font-medium">Loading notifications...</p>
            </div>
        );
    }

    const unreadCount = notifications.filter(n => n.status === 'unread').length;
    const filtered = filter === 'all' ? notifications : notifications.filter(n => n.status === filter);

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertCircle size={14} className="text-rose-500" />;
            case 'info': return <Info size={14} className="text-blue-500" />;
            case 'success': return <Check size={14} className="text-emerald-500" />;
            default: return <Bell size={14} className="text-slate-400" />;
        }
    };

    return (
        <div className="max-w-[900px] mx-auto px-4 py-6 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0F1626] dark:bg-indigo-600 p-2.5 rounded-xl text-white">
                        <Bell size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Notifications</h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                        </p>
                    </div>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg border border-indigo-100 transition-colors"
                    >
                        <CheckCheck size={14} />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-5">
                {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'read', label: 'Read' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.id
                            ? 'bg-[#0F1626] dark:bg-indigo-600 text-white'
                            : 'text-slate-500 bg-slate-100 dark:bg-white/5 hover:bg-slate-200'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white dark:bg-[#1A1F2C]/50 rounded-xl border border-slate-100 dark:border-white/5 divide-y divide-slate-50 dark:divide-white/5 overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center">
                            <Bell size={20} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-400">No notifications to show</p>
                    </div>
                ) : (
                    filtered.map((notif) => (
                        <div
                            key={notif.id}
                            className={`flex items-start gap-3 p-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5 ${notif.status === 'unread' ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''
                                }`}
                        >
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-white">{notif.title || notif.message}</p>
                                {notif.body && <p className="text-xs text-slate-400 mt-0.5">{notif.body}</p>}
                                <div className="flex items-center gap-1 mt-1.5">
                                    <Clock size={10} className="text-slate-300" />
                                    <span className="text-xs text-slate-400">
                                        {new Date(notif.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            {notif.status === 'unread' && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <Check size={12} />
                                    Read
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
