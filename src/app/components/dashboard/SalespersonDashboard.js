import React from 'react';
import { LineChartComponent } from "../charts/linechart";
import { PieChartComponent } from "../charts/donutchart";
import { StatCard } from "./StatCard";
import NewLeadCard from "../cards/newLeadCard";
import ActivityTab from "../../../pages/activity";
import { UserCircle, Target, Trophy, Clock, ArrowUpRight, Bell, Zap } from "lucide-react";
import Link from 'next/link';

// ── Reusable section card ─────────────────────────────────────────────────────
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

// ── Legend row used in pie charts ─────────────────────────────────────────────
function LegendRow({ color, label, value }) {
    return (
        <div className="flex items-center justify-between py-2 group">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <span className="text-xs font-bold text-slate-700">{value}</span>
        </div>
    );
}

export const SalespersonDashboard = ({ data }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* ── Page Header ── */}
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <UserCircle className="text-white" size={20} />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight">Personal Performance</h1>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Tracking your leads and monthly targets</p>
                </div>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {data.summary.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        color={['indigo', 'green', 'blue', 'amber'][idx] || 'indigo'}
                    />
                ))}
            </div>

            {/* ── Reminders Section ── */}
            {data.remindersToday && data.remindersToday.length > 0 && (
                <SectionCard
                    icon={<Bell />}
                    iconBg="bg-rose-50"
                    iconColor="text-rose-600"
                    title="Action Required: Today's Reminders"
                    action={
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-rose-500 animate-pulse">
                            {data.remindersToday.length} Pending
                        </span>
                    }
                >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.remindersToday.map((reminder) => (
                            <Link
                                key={reminder.id}
                                href={`/leads/details/${reminder.id}`}
                                className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm shadow-sm group-hover:text-rose-600 group-hover:border-rose-200 transition-all">
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
                                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-12 gap-6">
                <SectionCard
                    className="col-span-12 lg:col-span-8"
                    icon={<Trophy />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title={data.charts?.personalTrend?.title || "Monthly Performance"}
                >
                    <div className="p-6 h-[320px]">
                        <LineChartComponent
                            data={data.charts?.personalTrend?.data || []}
                            chartConfig={{ count: { label: "My Leads", color: "#6366f1" } }}
                        />
                    </div>
                </SectionCard>

                <SectionCard
                    className="col-span-12 lg:col-span-4"
                    icon={<Target />}
                    iconBg="bg-green-50"
                    iconColor="text-green-600"
                    title="Pipeline Distribution"
                >
                    <div className="p-6">
                        <PieChartComponent radius={70} data={data.charts?.personalStages?.data || []} />
                        <div className="mt-4 divide-y divide-slate-50">
                            {data.charts?.personalStages?.data?.map((entry, idx) => (
                                <LegendRow key={idx} color={entry.color} label={entry.label} value={entry.value} />
                            ))}
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* ── Bottom Section: Recent Leads + Activities ── */}
            <div className="grid grid-cols-12 gap-6">
                <SectionCard
                    className="col-span-12 lg:col-span-6"
                    icon={<Clock />}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    title="My Recent Leads"
                    action={
                        <Link href="/leads" className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                            View All <ArrowUpRight size={12} />
                        </Link>
                    }
                >
                    <div className="p-4 space-y-3 h-[400px] overflow-y-auto">
                        {data.recentLeads?.map((lead) => (
                            <NewLeadCard key={lead.id} data={lead} />
                        ))}
                    </div>
                </SectionCard>

                {data.featureKeys?.includes('activity_log') && (
                    <SectionCard
                        className="col-span-12 lg:col-span-6"
                        icon={<Zap />}
                        iconBg="bg-slate-50"
                        iconColor="text-slate-600"
                        title="Personal Timeline"
                    >
                        <div className="h-[400px] overflow-y-auto">
                            <ActivityTab showHeader={false} />
                        </div>
                    </SectionCard>
                )}
            </div>
        </div>
    );
};
