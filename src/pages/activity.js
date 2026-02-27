import React, { useState, useEffect } from 'react';
import { Calendar, User, FileText, MessageSquare, Clock, Activity, Loader2, ArrowRight, Zap } from 'lucide-react';
import axios from 'axios';
import { getRelativeTime } from '@/utils/utility';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/components/ui/card";

const ActivityTab = ({ showHeader = true }) => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const res = await axios.get('/api/activities');
            if (res.data.status === 200) {
                setActivities(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();

        const eventSource = new EventSource('/api/activities/stream');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.sseType === 'activity' || !data.sseType) {
                setActivities((prev) => [data, ...prev].slice(0, 50));
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE Error:", error);
            eventSource.close();
        };

        const timer = setInterval(() => {
            setActivities((prev) => [...prev]);
        }, 30000);

        return () => {
            eventSource.close();
            clearInterval(timer);
        };
    }, []);

    const filters = [
        { value: 'all', label: 'All Activity' },
        { value: 'Comment', label: 'Comments' },
        { value: 'Stage Change', label: 'Stages' },
        { value: 'Assign', label: 'Assignments' }
    ];

    const filteredActivities = selectedFilter === 'all'
        ? activities
        : activities.filter(activity => activity.type === selectedFilter);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'Stage Change':
                return <div className="bg-blue-50 p-2 sm:p-2.5 rounded-xl border border-blue-100"><FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" /></div>;
            case 'Comment':
                return <div className="bg-emerald-50 p-2 sm:p-2.5 rounded-xl border border-emerald-100"><MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" /></div>;
            case 'Assign':
                return <div className="bg-purple-50 p-2 sm:p-2.5 rounded-xl border border-purple-100"><User className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" /></div>;
            default:
                return <div className="bg-indigo-50 p-2 sm:p-2.5 rounded-xl border border-indigo-100"><Clock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" /></div>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading Feed...</p>
            </div>
        );
    }

    return (
        <div className={`mx-auto ${showHeader ? 'max-w-[1600px] py-3 sm:py-4 px-2 sm:px-4' : 'w-full'} animate-in fade-in duration-500`}>
            {showHeader && (
                <div className="flex items-center gap-3 mb-5 sm:mb-8">
                    <div className="bg-[#0F1626] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg shadow-gray-200">
                        <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-extrabold text-[#0F1626] tracking-tight leading-tight">Activity</h1>
                        <p className="text-xs sm:text-sm font-medium text-gray-400 mt-0.5 hidden sm:block">Real-time tracker for all lead interactions</p>
                    </div>
                </div>
            )}

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                {showHeader && (
                    <CardHeader className="bg-gray-50/30 border-b border-gray-100 py-3 px-4 sm:py-4 sm:px-6">
                        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                            {filters.map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200 uppercase tracking-wider border whitespace-nowrap shrink-0 ${selectedFilter === filter.value
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-100 hover:text-indigo-500 hover:bg-indigo-50/30'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                )}
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={`py-3.5 px-4 sm:py-5 sm:px-6 flex items-start gap-3 sm:gap-5 transition-all duration-300 hover:bg-gray-50/50`}
                                >
                                    <div className="shrink-0 mt-0.5">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                                        <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                                            <span className="text-sm font-bold text-[#0F1626] shrink-0">
                                                {activity.superAdmin?.name || activity.user?.name || 'System'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 self-center" />
                                            <p className="text-sm font-medium text-gray-600 flex-1 min-w-0 break-words">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {activity.lead && (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50/50 rounded-lg border border-indigo-100/30">
                                                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">Lead</span>
                                                    <span className="font-bold text-[#0F1626] text-[11px] max-w-[100px] sm:max-w-[150px] truncate">
                                                        {activity.lead.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                <Clock className="h-3 w-3 mr-1 text-gray-300" />
                                                {getRelativeTime(activity.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-16 sm:py-24 text-center flex flex-col items-center justify-center text-gray-400 gap-4">
                                <div className="bg-gray-50 p-5 rounded-3xl border-2 border-dashed border-gray-100">
                                    <Activity className="h-10 w-10 opacity-20" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-gray-400">Quiet day...</p>
                                    <p className="text-xs font-medium uppercase tracking-widest mt-1">No activities found</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {showHeader && filteredActivities.length > 5 && (
                <div className="mt-6 text-center">
                    <button className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-[#0F1626] text-white text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all hover:shadow-xl hover:shadow-indigo-100 transform hover:-translate-y-1">
                        Load More History
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;
