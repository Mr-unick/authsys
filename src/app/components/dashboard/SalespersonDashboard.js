import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import NewLeadCard from "../cards/newLeadCard";
import ActivityTab from "../../../pages/activity";
import { UserCircle, Target, Trophy, Clock, ArrowUpRight, Bell } from "lucide-react";
import Link from 'next/link';

export const SalespersonDashboard = ({ data }) => {
    return (
        <div className="space-y-5 sm:space-y-8 animate-in fade-in duration-700">
            {/* Personal Header */}
            <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg shadow-indigo-100">
                    <UserCircle className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-[#0F1626]">Personal Performance</h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:block">Tracking your leads and monthly targets</p>
                </div>
            </div>

            {/* Summary Row — 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {data.summary.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        color={idx === 0 ? 'indigo' : idx === 1 ? 'green' : idx === 2 ? 'blue' : 'amber'}
                    />
                ))}
            </div>

            {/* Today's Reminders Section */}
            {data.remindersToday && data.remindersToday.length > 0 && (
                <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-[#0F1626] text-white">
                    <CardHeader className="border-b border-white/5 py-4 sm:py-5 px-6 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                                <Bell className="h-4 w-4" />
                            </div>
                            Action Required: Today's Reminders
                        </CardTitle>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 animate-pulse">
                            {data.remindersToday.length} Pending
                        </span>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {data.remindersToday.map((reminder) => (
                                <Link
                                    key={reminder.id}
                                    href={`/leads/details/${reminder.id}`}
                                    className="group flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold group-hover:scale-110 transition-transform">
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
                                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
                {/* My Monthly Performance */}
                <Card className="col-span-1 lg:col-span-8 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 py-4 sm:py-6 px-4 sm:px-6">
                        <CardTitle className="text-sm sm:text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Trophy className="text-indigo-600" size={16} />
                            </div>
                            {data.charts?.personalTrend?.title || "Monthly Performance"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-8">
                        <div className="h-[220px] sm:h-[300px] w-full mt-2 sm:mt-4">
                            <LineChartComponent
                                data={data.charts?.personalTrend?.data || []}
                                chartConfig={{ count: { label: "My Leads", color: "#4E49F2" } }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Leads by Stage */}
                <Card className="col-span-1 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 py-4 sm:py-6 px-4 sm:px-6">
                        <CardTitle className="text-sm sm:text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Target className="text-green-600" size={16} />
                            </div>
                            Pipeline Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts?.personalStages?.data || []} />
                        <div className="w-full mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
                            {data.charts?.personalStages?.data?.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs px-2">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                        <span className="text-gray-500 font-medium">{entry.label}</span>
                                    </div>
                                    <span className="font-bold text-[#0F1626]">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8">
                {/* Recent Leads Feed */}
                <Card className="col-span-1 lg:col-span-6 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between py-4 sm:py-6 px-4 sm:px-6">
                        <CardTitle className="text-sm sm:text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Clock className="text-amber-600" size={16} />
                            </div>
                            My Recent Leads
                        </CardTitle>
                        <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                            View All <ArrowUpRight size={12} />
                        </button>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                            {data.recentLeads?.map((lead) => (
                                <NewLeadCard key={lead.id} data={lead} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* My Activity Summary */}
                {data.featureKeys?.includes('activity_log') && (
                    <Card className="col-span-1 lg:col-span-6 border-none shadow-sm rounded-2xl flex flex-col h-[350px] sm:h-[400px] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-4 sm:py-5 px-4 sm:px-6">
                            <CardTitle className="text-sm sm:text-base font-bold text-[#0F1626] flex items-center gap-3">
                                Personal Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide">
                            <ActivityTab showHeader={false} />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
