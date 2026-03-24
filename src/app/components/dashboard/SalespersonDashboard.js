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
        <div className={`bg-white rounded-xl border border-slate-100 overflow-hidden ${className}`}>
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${iconBg} border ${iconBg.replace('bg-', 'border-')} flex items-center justify-center flex-shrink-0`}>
                        {React.cloneElement(icon, { size: 16, className: iconColor })}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
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
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs text-slate-500 font-medium">{label}</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    );
}

export const SalespersonDashboard = ({ data }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-300 pb-16">
            {/* ── Page Header ── */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                    <UserCircle className="text-white" size={18} />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800">Personal Performance</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Tracking your leads and monthly targets</p>
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
                        <span className="text-xs font-semibold text-rose-500">
                            {data.remindersToday.length} Pending
                        </span>
                    }
                >
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {data.remindersToday.map((reminder) => (
                            <Link
                                key={reminder.id}
                                href={`/leads/details/${reminder.id}`}
                                className="group flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-semibold text-sm group-hover:text-rose-600 group-hover:border-rose-200 transition-colors">
                                        {reminder.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">{reminder.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                            <Clock size={9} />
                                            {new Date(reminder.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                            </Link>
                        ))}
                    </div>
                </SectionCard>
            )}

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-12 gap-5">
                <SectionCard
                    className="col-span-12 lg:col-span-8"
                    icon={<Trophy />}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                    title={data.charts?.personalTrend?.title || "Monthly Performance"}
                >
                    <div className="p-5 h-[300px]">
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
                    <div className="p-5">
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
            <div className="grid grid-cols-12 gap-5">
                <SectionCard
                    className="col-span-12 lg:col-span-6"
                    icon={<Clock />}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                    title="My Recent Leads"
                    action={
                        <Link href="/leads" className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                            View All <ArrowUpRight size={12} />
                        </Link>
                    }
                >
                    <div className="p-4 space-y-2 h-[400px] overflow-y-auto">
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
