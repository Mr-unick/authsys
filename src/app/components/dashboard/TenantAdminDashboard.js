import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { UserProfileView } from "./UserProfileView";
import UserTable from "../tables/userTable";
import ActivityTab from "../../../pages/activity";
import { LayoutDashboard, Users, Zap, TrendingUp, Target, BarChart3, Bell, Clock, ArrowUpRight } from "lucide-react";
import { LeadSourceAnalytics } from "./LeadSourceAnalytics";
import Link from 'next/link';

export const TenantAdminDashboard = ({ data }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    if (selectedUserId) {
        return <UserProfileView userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Business Overview Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
                    <LayoutDashboard className="text-white h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#0F1626]">Business Intelligence</h2>
                    <p className="text-sm text-gray-500 font-medium">Monitoring team performance and lead conversion</p>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.summary.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        color={idx === 0 ? 'blue' : idx === 1 ? 'indigo' : idx === 2 ? 'green' : 'amber'}
                    />
                ))}
            </div>

            {/* Today's Reminders Section */}
            {data.remindersToday && data.remindersToday.length > 0 && (
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-[#0F1626] text-white">
                    <CardHeader className="border-b border-white/5 py-4 sm:py-5 px-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <Bell className="h-4 w-4" />
                            </div>
                            Team Reminders & Follow-ups
                        </CardTitle>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                            {data.remindersToday.length} Actions Today
                        </span>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.remindersToday.map((reminder) => (
                                <Link
                                    key={reminder.id}
                                    href={`/leads/details/${reminder.id}`}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold group-hover:scale-110 transition-transform">
                                            {reminder.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold truncate max-w-[120px]">{reminder.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                                                    <Clock size={10} /> {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Middle Section: Trends and Pipeline */}
            <div className="grid grid-cols-12 gap-8">
                {/* Lead Trend */}
                <Card className="col-span-12 lg:col-span-8 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <TrendingUp className="text-blue-600" size={18} />
                            </div>
                            {data.charts.leadsByMonth.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <LineChartComponent
                                data={data.charts.leadsByMonth.data}
                                chartConfig={{ count: { label: "Incoming Leads", color: "#3B82F6" } }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Pipeline Distribution */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Target className="text-indigo-600" size={18} />
                            </div>
                            Pipeline Stages
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.stageDistribution.data.map(s => ({ label: s.label, value: s.count, color: s.color }))} />
                        <div className="w-full mt-8 space-y-3">
                            {data.charts.stageDistribution.data.map((stage, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs px-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                        <span className="text-gray-500 font-semibold">{stage.label}</span>
                                    </div>
                                    <span className="font-bold text-[#0F1626]">{stage.count}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Performance Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Leaderboard */}
                <Card className="col-span-12 lg:col-span-12 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Users className="text-green-600" size={18} />
                            </div>
                            Team Conversion Leaderboard
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-4">Sales Professional</th>
                                        <th className="px-8 py-4">Assigned Leads</th>
                                        <th className="px-8 py-4">Closed Won</th>
                                        <th className="px-8 py-4">Success Rate</th>
                                        <th className="px-8 py-4">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {data.leaderboard.map((user, idx) => (
                                        <tr
                                            key={user.id}
                                            onClick={() => setSelectedUserId(user.id)}
                                            className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                        >
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img src={user.profileImg} className="h-10 w-10 rounded-xl" alt={user.name} />
                                                        {idx === 0 && <span className="absolute -top-2 -right-2 text-yellow-400">👑</span>}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-[#0F1626]">{user.name}</div>
                                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Elite Member</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-bold text-[#0F1626]">{user.assigned}</td>
                                            <td className="px-8 py-5 text-sm font-bold text-green-600">+{user.conversions}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-extrabold text-[#0F1626]">{user.rate}%</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="h-1.5 w-24 bg-gray-50 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${user.rate}%` }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Integration & Analytics Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <BarChart3 className="text-indigo-600" size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F1626]">Integration Analytics</h3>
                </div>
                <LeadSourceAnalytics />
            </div>

            {/* Live Performance Pulse */}
            <div className="grid grid-cols-12 gap-8">
                <Card className="col-span-12 lg:col-span-12 border-none shadow-sm rounded-2xl flex flex-col h-[550px] overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-5">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Zap className="text-indigo-600 font-bold" size={18} />
                            </div>
                            Live Performance Pulse
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide">
                        <ActivityTab showHeader={false} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
