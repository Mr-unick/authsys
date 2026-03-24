import React from 'react';
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { Building2, Globe, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import ActivityTab from "../../../pages/activity";
import { GettingStarted } from '../onboarding/GettingStarted';

// ── Reusable section card ─────────────────────────────────────────────────────
function SectionCard({ icon, iconBg, iconColor, title, children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden ${className}`}>
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100">
                <div className={`w-8 h-8 rounded-lg ${iconBg} border ${iconBg.replace('bg-', 'border-')} flex items-center justify-center flex-shrink-0`}>
                    {React.cloneElement(icon, { size: 16, className: iconColor })}
                </div>
                <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
            </div>
            {children}
        </div>
    );
}

// ── Legend row used in pie charts ─────────────────────────────────────────────
function LegendRow({ color, label, value }) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    );
}

export const SuperAdminDashboard = ({ data }) => {
    const isBusinessAdmin = data.role === 'BUSINESS_ADMIN';

    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">
            {/* Onboarding Guide */}
            {isBusinessAdmin && data.onboardingStats && <GettingStarted stats={data.onboardingStats} />}

            {/* ── Page Header ── */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${isBusinessAdmin ? 'bg-blue-600' : 'bg-indigo-600'} flex items-center justify-center`}>
                    <ShieldCheck className="text-white" size={18} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800">
                        {isBusinessAdmin ? 'Business Intelligence Center' : 'Platform Control Center'}
                    </h1>
                    <p className="text-xs text-slate-400 mt-0.5">
                        {isBusinessAdmin
                            ? 'Monitor enterprise branches and team performance'
                            : 'Real-time cross-tenant monitoring and analytics'}
                    </p>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.summary.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        color={['indigo', 'blue', 'amber', 'green'][idx] || 'indigo'}
                    />
                ))}
            </div>

            {/* ── Growth Chart + User Distribution ── */}
            <div className="grid grid-cols-12 gap-5">
                <SectionCard
                    className="col-span-12 lg:col-span-8"
                    icon={<Globe />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title={isBusinessAdmin ? data.charts.leadGrowth?.title : data.charts.leadAnalytics?.title}
                >
                    <div className="p-5 h-[300px]">
                        <LineChartComponent
                            data={isBusinessAdmin ? data.charts.leadGrowth?.data : data.charts.leadAnalytics?.data}
                            chartConfig={{ count: { label: isBusinessAdmin ? "Business Leads" : "Platform Leads", color: "#6366f1" } }}
                        />
                    </div>
                </SectionCard>

                <SectionCard
                    className="col-span-12 lg:col-span-4"
                    icon={<BarChart3 />}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                    title={data.charts.userDistribution?.title}
                >
                    <div className="p-5">
                        <PieChartComponent radius={70} data={data.charts.userDistribution?.data} />
                        <div className="mt-4 divide-y divide-slate-50">
                            {data.charts.userDistribution?.data.map((entry, idx) => (
                                <LegendRow key={idx} color={entry.color} label={entry.label} value={entry.value} />
                            ))}
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ── Lead Sources + Pipeline / Tickets ── */}
            <div className="grid grid-cols-12 gap-5">
                <SectionCard
                    className="col-span-12 lg:col-span-4"
                    icon={<Globe />}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    title={data.charts.leadSources?.title}
                >
                    <div className="p-5">
                        <PieChartComponent radius={70} data={data.charts.leadSources?.data} />
                        <div className="mt-4 divide-y divide-slate-50">
                            {data.charts.leadSources?.data.map((entry, idx) => (
                                <LegendRow key={idx} color={entry.fill} label={entry.label} value={entry.value} />
                            ))}
                        </div>
                    </div>
                </SectionCard>

                {isBusinessAdmin ? (
                    <SectionCard
                        className="col-span-12 lg:col-span-8"
                        icon={<BarChart3 />}
                        iconBg="bg-amber-50"
                        iconColor="text-amber-600"
                        title={data.charts.pipeline?.title}
                    >
                        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {data.charts.pipeline?.data.map((stage, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 transition-colors">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
                                    <span className="text-xs font-medium text-slate-400 text-center">{stage.label}</span>
                                    <span className="text-xl font-bold text-slate-800">{stage.count}</span>
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                ) : (
                    <>
                        <SectionCard
                            className="col-span-12 lg:col-span-4"
                            icon={<Zap />}
                            iconBg="bg-sky-50"
                            iconColor="text-sky-600"
                            title={data.charts.ticketStatus?.title}
                        >
                            <div className="p-5">
                                <PieChartComponent radius={70} data={data.charts.ticketStatus?.data} />
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {data.charts.ticketStatus?.data.map((entry, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-xs font-medium text-slate-400">{entry.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionCard>

                        <SectionCard
                            className="col-span-12 lg:col-span-4"
                            icon={<BarChart3 />}
                            iconBg="bg-rose-50"
                            iconColor="text-rose-600"
                            title={data.charts.ticketPriority?.title}
                        >
                            <div className="p-5">
                                <PieChartComponent radius={70} data={data.charts.ticketPriority?.data} />
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {data.charts.ticketPriority?.data.map((entry, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                <span className="text-xs font-medium text-slate-400">{entry.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{entry.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionCard>
                    </>
                )}
            </div>

            {/* ── Live Activity Feed ── */}
            {(data.featureKeys?.includes('activity_log') || data.role === 'SUPER_ADMIN') && (
                <SectionCard
                    icon={<Zap />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title="Live Activity Feed"
                >
                    <div className="h-[480px] overflow-y-auto">
                        <ActivityTab showHeader={false} />
                    </div>
                </SectionCard>
            )}

            {/* ── Recent Entities Table ── */}
            <SectionCard
                icon={<Building2 />}
                iconBg={isBusinessAdmin ? 'bg-emerald-50' : 'bg-amber-50'}
                iconColor={isBusinessAdmin ? 'text-emerald-600' : 'text-amber-600'}
                title={isBusinessAdmin ? 'Recently Added Branches' : 'Recently Added Tenants'}
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                {[
                                    isBusinessAdmin ? 'Branch Name' : 'Business Name',
                                    isBusinessAdmin ? 'Branch Code' : 'Owner',
                                    'Contact',
                                    isBusinessAdmin ? 'Added On' : 'Joined Date',
                                    'Status'
                                ].map(h => (
                                    <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {(isBusinessAdmin ? data.branches.recent : data.tenants.recent).map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">
                                        {isBusinessAdmin ? item.name : item.business_name}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-slate-500 font-medium">
                                        {isBusinessAdmin ? item.branch_code : item.owner_name}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-slate-400">{item.email}</td>
                                    <td className="px-5 py-3.5 text-sm text-slate-400">
                                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${isBusinessAdmin
                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                            }`}>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>
        </div>
    );
};
