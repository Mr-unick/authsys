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
        indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
        blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
        green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' },
    };
    const p = palette[color] || palette.indigo;

    return (
        <div className="bg-white rounded-xl border border-slate-100 p-5 hover:border-slate-200 transition-colors duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg ${p.bg} ${p.text} border ${p.border} flex items-center justify-center flex-shrink-0`}>
                    {getIcon()}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${trendDir === 'up'
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                            : trendDir === 'down'
                                ? 'text-red-500 bg-red-50 border border-red-100'
                                : 'text-slate-500 bg-slate-50 border border-slate-100'
                        }`}>
                        {trendDir === 'up' ? <TrendingUp size={10} /> : trendDir === 'down' ? <TrendingDown size={10} /> : <Minus size={10} />}
                        {trend}
                    </div>
                )}
            </div>
            <p className="text-xs font-medium text-slate-400 mb-1">{label}</p>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">{value}</h3>
            {sub && <p className="text-xs text-slate-400 mt-1.5">{sub}</p>}
        </div>
    );
};
