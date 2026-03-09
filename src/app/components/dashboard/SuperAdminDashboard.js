import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { Building2, Globe, ShieldCheck, Zap } from "lucide-react";
import ActivityTab from "../../../pages/activity";
import { GettingStarted } from '../onboarding/GettingStarted';

export const SuperAdminDashboard = ({ data }) => {
    const isBusinessAdmin = data.role === 'BUSINESS_ADMIN';

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Onboarding Guide for Business Admins */}
            {isBusinessAdmin && data.onboardingStats && <GettingStarted stats={data.onboardingStats} />}

            {/* Contextual Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className={`${isBusinessAdmin ? 'bg-blue-600' : 'bg-indigo-600'} p-3 rounded-2xl ${isBusinessAdmin ? '' : ''}`}>
                    <ShieldCheck className="text-white h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#0F1626] dark:text-white">{isBusinessAdmin ? 'Business Intelligence Center' : 'Platform Control Center'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{isBusinessAdmin ? 'Monitoring enterprise branches and team performance' : 'Real-time cross-tenant monitoring and analytics'}</p>
                </div>
            </div>

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.summary.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        color={idx === 0 ? 'indigo' : idx === 1 ? 'blue' : idx === 2 ? 'amber' : 'green'}
                    />
                ))}
            </div>

            {/* Main Analytics: Growth & Distribution */}
            <div className="grid grid-cols-12 gap-8">
                {/* Growth Chart */}
                <Card className="col-span-12 lg:col-span-8 border border-gray-100 rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                                <Globe className="text-indigo-600 dark:text-indigo-400" size={18} />
                            </div>
                            {isBusinessAdmin ? data.charts.leadGrowth?.title : data.charts.leadAnalytics?.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <LineChartComponent
                                data={isBusinessAdmin ? data.charts.leadGrowth?.data : data.charts.leadAnalytics?.data}
                                chartConfig={{ count: { label: isBusinessAdmin ? "Business Leads" : "Platform Leads", color: "#4E49F2" } }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* User Distribution */}
                <Card className="col-span-12 lg:col-span-4 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.userDistribution?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.userDistribution?.data} />
                        <div className="w-full mt-8 space-y-4">
                            {data.charts.userDistribution?.data.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                        <span className="text-sm text-gray-500 font-semibold">{entry.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-[#0F1626]">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Secondary Analytics */}
            <div className="grid grid-cols-12 gap-8">
                {/* Lead Sources */}
                <Card className="col-span-12 lg:col-span-4 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.leadSources?.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.leadSources?.data} />
                        <div className="w-full mt-8 space-y-4">
                            {data.charts.leadSources?.data.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                                        <span className="text-sm text-gray-500 font-semibold">{entry.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-[#0F1626]">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {isBusinessAdmin ? (
                    /* Pipeline for Business Admin */
                    <Card className="col-span-12 lg:col-span-8 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="bg-white border-b border-gray-50 py-6">
                            <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.pipeline?.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 flex flex-col items-center">
                            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {data.charts.pipeline?.data.map((stage, idx) => (
                                    <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{stage.label}</span>
                                        <span className="text-xl font-black text-[#0F1626] dark:text-white">{stage.count}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Support Tickets for Super Admin */}
                        <Card className="col-span-12 lg:col-span-4 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="bg-white border-b border-gray-50 py-6">
                                <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.ticketStatus?.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 flex flex-col items-center">
                                <PieChartComponent radius={75} data={data.charts.ticketStatus?.data} />
                                <div className="w-full mt-8 grid grid-cols-2 gap-4">
                                    {data.charts.ticketStatus?.data.map((entry, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-2 bg-gray-50 p-2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{entry.label}</span>
                                            </div>
                                            <span className="text-sm font-black text-[#0F1626]">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-12 lg:col-span-4 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="bg-white border-b border-gray-50 py-6">
                                <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.ticketPriority?.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 flex flex-col items-center">
                                <PieChartComponent radius={75} data={data.charts.ticketPriority?.data} />
                                <div className="w-full mt-8 grid grid-cols-2 gap-4">
                                    {data.charts.ticketPriority?.data.map((entry, idx) => (
                                        <div key={idx} className="flex items-center justify-between px-2 bg-gray-50 p-2 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{entry.label}</span>
                                            </div>
                                            <span className="text-sm font-black text-[#0F1626]">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Live Performance Pulse (Activity) */}
            {(data.featureKeys?.includes('activity_log') || data.role === 'SUPER_ADMIN') && (
                <div className="grid grid-cols-12 gap-8">
                    <Card className="col-span-12 lg:col-span-12 border border-gray-100 rounded-2xl flex flex-col h-[550px] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 py-5">
                            <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                                <div className="p-2 bg-white rounded-lg">
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
            )}

            {/* Jurisdictional Entities (Tenants or Branches) */}
            <Card className="border border-gray-100 rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 py-6">
                    <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                        <div className={`p-2 ${isBusinessAdmin ? 'bg-emerald-50' : 'bg-amber-50'} rounded-lg`}>
                            <Building2 className={isBusinessAdmin ? 'text-emerald-600' : 'text-amber-600'} size={18} />
                        </div>
                        {isBusinessAdmin ? 'Recently Added Branches' : 'Recently Added Tenants'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">{isBusinessAdmin ? 'Branch Name' : 'Business Name'}</th>
                                    <th className="px-8 py-4">{isBusinessAdmin ? 'Branch Code' : 'Owner'}</th>
                                    <th className="px-8 py-4">Contact</th>
                                    <th className="px-8 py-4">{isBusinessAdmin ? 'Added On' : 'Joined Date'}</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(isBusinessAdmin ? data.branches.recent : data.tenants.recent).map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-[#0F1626] dark:text-white">{isBusinessAdmin ? item.name : item.business_name}</div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-gray-600 dark:text-gray-300">{isBusinessAdmin ? item.branch_code : item.owner_name}</td>
                                        <td className="px-8 py-5 text-sm text-gray-500">{item.email}</td>
                                        <td className="px-8 py-5 text-sm text-gray-500">
                                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 ${isBusinessAdmin ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'} text-[10px] font-bold rounded-full uppercase tracking-widest border`}>
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
