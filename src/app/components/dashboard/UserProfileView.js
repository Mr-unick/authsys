import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/components/ui/card";
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { X, Loader2, Mail, Briefcase, Calendar as CalendarIcon, Clock, ArrowLeft, Download } from "lucide-react";
import { getRelativeTime } from '@/utils/utility';

export const UserProfileView = ({ userId, onBack }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const reportRef = useRef(null);

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

    const handleGeneratePDF = async () => {
        if (!reportRef.current || generating) return;
        setGenerating(true);
        const toastId = toast.loading("Preparing high-resolution PDF...");

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#f9fafb",
                windowWidth: reportRef.current.scrollWidth,
                windowHeight: reportRef.current.scrollHeight
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Report_${data.user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);

            toast.update(toastId, { render: "Report downloaded!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error("PDF Error:", error);
            toast.update(toastId, { render: "Generation failed", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-400 font-medium">Analyzing Profile...</p>
        </div>
    );

    if (!data) return <div className="p-20 text-center text-gray-400">Profile data unavailable</div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {/* Header / Actions - NOT in PDF */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-100"
                    >
                        <ArrowLeft className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={18} />
                    </button>
                    <h2 className="text-lg font-bold text-slate-800">User Performance Analytics</h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleGeneratePDF}
                        disabled={generating}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        {generating ? 'Processing...' : 'Generate PDF'}
                    </button>
                </div>
            </div>

            {/* Printable Content Wrapper */}
            <div ref={reportRef} className="space-y-8 p-4 bg-[#f9fafb]">
                {/* Profile Information */}
                <div className="flex items-center gap-4 bg-white p-5 rounded-xl border border-slate-100">
                    <img src={data.user.profileImg} className="h-16 w-16 rounded-xl border border-slate-200" alt={data.user.name} />
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{data.user.name}</h2>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <Mail size={11} className="text-indigo-500" /> {data.user.email}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                                <Briefcase size={11} className="text-indigo-500" /> Sales Professional
                            </span>
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {data.stats.map((stat, idx) => (
                        <StatCard key={idx} {...stat} />
                    ))}
                </div>

                <div className="grid grid-cols-12 gap-5">
                    {/* Trend Chart */}
                    <Card className="col-span-12 lg:col-span-8 border border-slate-100 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-100 px-5 py-3.5">
                            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <CalendarIcon className="text-indigo-600" size={18} />
                                </div>
                                Performance Trend
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5">
                            <div className="h-[300px] w-full">
                                <LineChartComponent
                                    data={data.charts.trend}
                                    chartConfig={{ count: { label: "Performance", color: "#4E49F2" } }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Breakdown */}
                    <Card className="col-span-12 lg:col-span-4 border border-slate-100 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-100 px-5 py-3.5">
                            <CardTitle className="text-sm font-semibold text-slate-700">Pipeline Mix</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 flex flex-col items-center">
                            <PieChartComponent radius={75} data={data.charts.stages} />
                            <div className="w-full mt-6 space-y-2 divide-y divide-slate-50">
                                {data.charts.stages.map((stage, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                            <span className="text-slate-500 font-medium">{stage.label}</span>
                                        </div>
                                        <span className="font-semibold text-slate-700">{stage.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Activity History */}
                <Card className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                    <CardHeader className="border-b border-slate-100 px-5 py-3.5">
                        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                <Clock className="text-slate-400" size={16} />
                            </div>
                            Recent Action Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {data.activities.map((activity) => (
                                <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                                    <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-sm font-medium text-slate-700">{activity.description}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            {activity.lead && (
                                                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                                    Lead: {activity.lead.name}
                                                </span>
                                            )}
                                            <span className="text-xs font-medium text-slate-400">
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
        </div>
    );
};
