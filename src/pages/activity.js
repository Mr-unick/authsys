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
import prisma from "@/app/lib/prisma";
import { jwtVerify } from 'jose';
import { env } from '@/config/env';
import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
    const token = context.req.cookies.token;

    if (!token) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    let user;
    try {
        const secretKey = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secretKey);
        user = payload;
    } catch (error) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }

    const rawRole = (typeof user.role === 'string' ? user.role : (user.role?.name || 'USER'));
    const role = rawRole.trim().toUpperCase();
    const isSuperAdmin = role.includes('SUPER') || (role.includes('ADMIN') && (!user.business || user.business === 0));

    if (isSuperAdmin) return { props: { restricted: false } };

    const feature = await prisma.businessFeature.findFirst({
        where: {
            business_id: user.business,
            feature_key: 'activity_log',
            is_enabled: true
        }
    });

    return {
        props: {
            restricted: !feature
        }
    };
}

const ActivityTab = ({ showHeader = true, restricted = false }) => {
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    if (restricted) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-700">
                <div className="bg-orange-50 p-6 rounded-full mb-6">
                    <Zap className="h-10 w-10 text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Activity Stream Restricted</h2>
                <p className="text-slate-500 max-w-md mx-auto text-sm">
                    The real-time activity logging feature is not enabled for your subscription.
                    Please contact your administrator to upgrade your plan.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-6 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const fetchActivities = async () => {
        try {
            const res = await axios.get('/api/activities', {
                validateStatus: (status) => status >= 200 && status < 500
            });
            if (res.status === 401) {
                router.push('/signin');
            } else if (res.data.status === 200) {
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
                return <div className="bg-blue-50 p-2 rounded-lg border border-blue-100"><FileText className="h-4 w-4 text-blue-600" /></div>;
            case 'Comment':
                return <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-100"><MessageSquare className="h-4 w-4 text-emerald-600" /></div>;
            case 'Assign':
                return <div className="bg-purple-50 p-2 rounded-lg border border-purple-100"><User className="h-4 w-4 text-purple-600" /></div>;
            default:
                return <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100"><Clock className="h-4 w-4 text-indigo-600" /></div>;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <p className="text-xs text-slate-400 font-medium">Loading Feed...</p>
            </div>
        );
    }

    return (
        <div className={`mx-auto ${showHeader ? 'max-w-[1600px] py-3 sm:py-4 px-2 sm:px-4' : 'w-full'} animate-in fade-in duration-500`}>
            {showHeader && (
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#0F1626] dark:bg-indigo-600 p-2.5 rounded-xl">
                        <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Activity</h1>
                        <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">Real-time tracker for all lead interactions</p>
                    </div>
                </div>
            )}

            <Card className="border border-slate-100 dark:border-white/5 rounded-xl overflow-hidden bg-white dark:bg-[#1A1F2C]/50">
                {showHeader && (
                    <CardHeader className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 py-3 px-4 sm:px-5">
                        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                            {filters.map(filter => (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${selectedFilter === filter.value
                                        ? 'bg-[#0F1626] dark:bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-white/5 text-slate-500 border border-slate-100 dark:border-white/5 hover:border-slate-200 hover:text-slate-700'
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                )}
                <CardContent className="p-0">
                    <div className="divide-y divide-slate-50 dark:divide-white/5">
                        {filteredActivities.length > 0 ? (
                            filteredActivities.map((activity) => (
                                <div
                                    key={activity.id}
                                    className={`py-3.5 px-4 sm:px-5 flex items-start gap-3 transition-colors hover:bg-slate-50/50 dark:hover:bg-white/5`}
                                >
                                    <div className="shrink-0 mt-0.5">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-grow min-w-0 flex flex-col gap-1.5">
                                        <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
                                            <span className="text-sm font-semibold text-slate-700 dark:text-white shrink-0">
                                                {activity.superAdmin?.name || activity.user?.name || 'System'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0 self-center" />
                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex-1 min-w-0 break-words">
                                                {activity.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {activity.lead && (
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
                                                    <span className="text-xs font-semibold text-indigo-600">Lead</span>
                                                    <span className="font-medium text-slate-700 text-xs max-w-[100px] sm:max-w-[150px] truncate">
                                                        {activity.lead.name}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-100 dark:border-white/5">
                                                <Clock className="h-3 w-3 mr-1 text-slate-300" />
                                                {getRelativeTime(activity.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-14 text-center flex flex-col items-center justify-center text-slate-400 gap-3">
                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
                                    <Activity className="h-8 w-8 opacity-20" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-400">No activities found</p>
                                    <p className="text-xs text-slate-300 mt-0.5">Quiet day so far</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {showHeader && filteredActivities.length > 5 && (
                <div className="mt-5 text-center">
                    <button className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Load More
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityTab;
