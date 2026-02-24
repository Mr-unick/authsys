import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { X, Loader2, Mail, Briefcase, Calendar as CalendarIcon, Clock, ArrowLeft } from "lucide-react";
import { getRelativeTime } from '@/utils/utility';

export const UserProfileView = ({ userId, onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const res = await axios.get(`/api/user/performance/${userId}`);
                if (res.data.status === 200) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user performance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformance();
    }, [userId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase">Analyzing Profile...</p>
        </div>
    );

    if (!data) return <div className="p-20 text-center text-gray-400">Profile data unavailable</div>;

    return (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            {/* Header / Back Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-2.5 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100 group shadow-sm"
                    >
                        <ArrowLeft className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <img src={data.user.profileImg} className="h-16 w-16 rounded-2xl shadow-lg border-2 border-white" alt={data.user.name} />
                        <div>
                            <h2 className="text-2xl font-bold text-[#0F1626]">{data.user.name}</h2>
                            <div className="flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Mail size={12} /> {data.user.email}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Briefcase size={12} /> Senior Sales Associate
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.stats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Trend Chart */}
                <Card className="col-span-12 lg:col-span-8 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-gray-50 py-5">
                        <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <CalendarIcon className="text-indigo-600" size={18} />
                            </div>
                            Performance Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="h-[300px] w-full">
                            <LineChartComponent
                                data={data.charts.trend}
                                chartConfig={{ count: { label: "Performance", color: "#4E49F2" } }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Status Breakdown */}
                <Card className="col-span-12 lg:col-span-4 border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-gray-50 py-5">
                        <CardTitle className="text-base font-bold text-[#0F1626]">Pipeline Mix</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex flex-col items-center">
                        <PieChartComponent radius={75} data={data.charts.stages} />
                        <div className="w-full mt-8 space-y-3">
                            {data.charts.stages.map((stage, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                        <span className="text-gray-500 font-semibold">{stage.label}</span>
                                    </div>
                                    <span className="font-bold text-[#0F1626]">{stage.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity History */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white">
                <CardHeader className="border-b border-gray-50 py-5">
                    <CardTitle className="text-base font-bold text-[#0F1626] flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Clock className="text-gray-400" size={18} />
                        </div>
                        Recent Action Log
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                        {data.activities.map((activity) => (
                            <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <Briefcase className="h-4 w-4 text-indigo-600" />
                                </div>
                                <div className="flex-grow">
                                    <p className="text-sm font-semibold text-[#0F1626]">{activity.description}</p>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        {activity.lead && (
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                                                Lead: {activity.lead.name}
                                            </span>
                                        )}
                                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                            {getRelativeTime(activity.timestamp)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
