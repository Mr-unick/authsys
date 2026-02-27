import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { Building2, Globe, ShieldCheck } from "lucide-react";

export const SuperAdminDashboard = ({ data }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            {/* Platform Overview Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100">
                    <ShieldCheck className="text-white h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[#0F1626]">Platform Control Center</h2>
                    <p className="text-sm text-gray-500 font-medium">Real-time cross-tenant monitoring and analytics</p>
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
                {/* Platform Growth */}
                <Card className="col-span-12 lg:col-span-8 border-none shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Globe className="text-indigo-600" size={18} />
                            </div>
                            {data.charts.leadAnalytics.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[350px] w-full">
                            <LineChartComponent
                                data={data.charts.leadAnalytics.data}
                                chartConfig={{ count: { label: "Total Platform Leads", color: "#4E49F2" } }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* User Distribution */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.userDistribution.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.userDistribution.data} />
                        <div className="w-full mt-8 space-y-4">
                            {data.charts.userDistribution.data.map((entry, idx) => (
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

            {/* Secondary Analytics: Lead Sources & Support Tickets */}
            <div className="grid grid-cols-12 gap-8">
                {/* Lead Source Distribution */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.leadSources.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.leadSources.data} />
                        <div className="w-full mt-8 space-y-4">
                            {data.charts.leadSources.data.map((entry, idx) => (
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

                {/* Support Status */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.ticketStatus.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.ticketStatus.data} />
                        <div className="w-full mt-8 grid grid-cols-2 gap-4">
                            {data.charts.ticketStatus.data.map((entry, idx) => (
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

                {/* Support Priority */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="bg-white border-b border-gray-50 py-6">
                        <CardTitle className="text-base font-bold text-[#0F1626]">{data.charts.ticketPriority.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.ticketPriority.data} />
                        <div className="w-full mt-8 grid grid-cols-2 gap-4">
                            {data.charts.ticketPriority.data.map((entry, idx) => (
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
            </div>

            {/* Recently Added Tenants */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 py-6">
                    <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Building2 className="text-amber-600" size={18} />
                        </div>
                        Recently Added Tenants
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">Business Name</th>
                                    <th className="px-8 py-4">Owner</th>
                                    <th className="px-8 py-4">Contact</th>
                                    <th className="px-8 py-4">Joined Date</th>
                                    <th className="px-8 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.tenants.recent.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="font-bold text-[#0F1626]">{tenant.business_name}</div>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-gray-600">{tenant.owner_name}</td>
                                        <td className="px-8 py-5 text-sm text-gray-500">{tenant.email}</td>
                                        <td className="px-8 py-5 text-sm text-gray-500">{new Date(tenant.created_at).toLocaleDateString()}</td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
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
