import React from 'react';
import { TrendingUp, TrendingDown, Users, Activity, Zap, Building2, Award, Minus } from "lucide-react";

export const StatCard = ({ label, value, trend, trendDir = 'up', icon, color = "indigo", sub }) => {
    const getIcon = () => {
        switch (icon) {
            case 'users': return <Users size={18} />;
            case 'activity': return <Activity size={18} />;
            case 'zap': return <Zap size={18} />;
            case 'business': return <Building2 size={18} />;
            case 'award': return <Award size={18} />;
            default: return <Activity size={18} />;
        }
    };

    const palette = {
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', ring: 'ring-indigo-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', ring: 'ring-blue-100' },
        green: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', ring: 'ring-amber-100' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-100' },
    };
    const p = palette[color] || palette.indigo;

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl ${p.bg} ${p.text} ring-1 ${p.ring} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    {getIcon()}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${trendDir === 'up'
                            ? 'text-emerald-600 bg-emerald-50 ring-1 ring-emerald-100'
                            : trendDir === 'down'
                                ? 'text-red-500 bg-red-50 ring-1 ring-red-100'
                                : 'text-slate-500 bg-slate-50 ring-1 ring-slate-100'
                        }`}>
                        {trendDir === 'up' ? <TrendingUp size={10} /> : trendDir === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-none">{value}</h3>
            {sub && <p className="text-xs text-slate-400 font-medium mt-1.5">{sub}</p>}
        </div>
    );
};
