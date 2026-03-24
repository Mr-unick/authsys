import React from 'react';
import { useState } from 'react';
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import { UserProfileView } from "./UserProfileView";
import ActivityTab from "../../../pages/activity";
import { LeadSourceAnalytics } from "./LeadSourceAnalytics";
import { LayoutDashboard, Users, Zap, TrendingUp, Target, BarChart3, Bell, Clock, ArrowUpRight } from "lucide-react";
import Link from 'next/link';
import { GettingStarted } from '../onboarding/GettingStarted';

function SectionCard({ icon, iconBg, iconColor, title, action, children, className = "" }) {
    return (
        <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm ${className}`}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
                        {React.cloneElement(icon, { size: 16, className: iconColor })}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

function LegendRow({ color, label, value }) {
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{value}</span>
        </div>
    );
}

export const TenantAdminDashboard = ({ data }) => {
    const [selectedUserId, setSelectedUserId] = useState(null);

    if (selectedUserId) {
        return <UserProfileView userId={selectedUserId} onBack={() => setSelectedUserId(null)} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {data.onboardingStats && <GettingStarted stats={data.onboardingStats} />}

            {/* ── Page Header ── */}
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                    <LayoutDashboard className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Business Intelligence</h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Monitor team performance and lead conversion</p>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.summary.map((stat, idx) => (
                    <StatCard key={idx} {...stat} color={['blue', 'indigo', 'green', 'amber'][idx] || 'indigo'} />
                ))}
            </div>

            {/* ── Reminders ── */}
            {data.remindersToday?.length > 0 && (
                <SectionCard
                    icon={<Bell />}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    title="Team Reminders & Follow-ups"
                    action={
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-amber-500">
                            {data.remindersToday.length} Actions Today
                        </span>
                    }
                >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.remindersToday.map((reminder) => (
                            <Link
                                key={reminder.id}
                                href={`/leads/details/${reminder.id}`}
                                className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm group-hover:scale-105 transition-transform">
                                        {reminder.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{reminder.name}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-0.5">
                                            <Clock size={9} />
                                            {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-12 gap-6">
                <SectionCard
                    className="col-span-12 lg:col-span-8"
                    icon={<TrendingUp />}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    title={data.charts.leadsByMonth.title}
                >
                    <div className="p-6 h-[300px]">
                        <LineChartComponent
                            data={data.charts.leadsByMonth.data}
                            chartConfig={{ count: { label: "Incoming Leads", color: "#3B82F6" } }}
                        />
                    </div>
                </SectionCard>

                <SectionCard
                    className="col-span-12 lg:col-span-4"
                    icon={<Target />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title="Pipeline Stages"
                >
                    <div className="p-6">
                        <PieChartComponent radius={70} data={data.charts.stageDistribution.data.map(s => ({ label: s.label, value: s.count, color: s.color }))} />
                        <div className="mt-4 divide-y divide-slate-50">
                            {data.charts.stageDistribution.data.map((stage, idx) => (
                                <LegendRow key={idx} color={stage.color} label={stage.label} value={stage.count} />
                            ))}
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ── Leaderboard ── */}
            <SectionCard
                icon={<Users />}
                iconBg="bg-emerald-50"
                iconColor="text-emerald-600"
                title="Team Conversion Leaderboard"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                {['Sales Professional', 'Assigned', 'Closed Won', 'Success Rate', 'Performance'].map(h => (
                                    <th key={h} className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.leaderboard.map((user, idx) => (
                                <tr
                                    key={user.id}
                                    onClick={() => setSelectedUserId(user.id)}
                                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <img src={user.profileImg} className="h-9 w-9 rounded-xl object-cover" alt={user.name} />
                                                {idx === 0 && <span className="absolute -top-2 -right-1.5 text-sm">👑</span>}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{user.name}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Elite Member</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-700">{user.assigned}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">+{user.conversions}</td>
                                    <td className="px-6 py-4 text-sm font-extrabold text-slate-800">{user.rate}%</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-1.5 w-20 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${user.rate}%` }} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </SectionCard>

            {/* ── Integration Analytics ── */}
            <SectionCard
                icon={<BarChart3 />}
                iconBg="bg-indigo-50"
                iconColor="text-indigo-600"
                title="Integration Analytics"
            >
                <div className="p-6">
                    <LeadSourceAnalytics />
                </div>
            </SectionCard>

            {/* ── Activity Feed ── */}
            {(data.featureKeys?.includes('activity_log') || data.role === 'SUPER_ADMIN') && (
                <SectionCard
                    icon={<Zap />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title="Live Performance Pulse"
                >
                    <div className="h-[480px] overflow-y-auto">
                        <ActivityTab showHeader={false} />
                    </div>
                </SectionCard>
            )}
        </div>
    );
};
