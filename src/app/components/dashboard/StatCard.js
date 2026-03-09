import React from 'react';
import { Card, CardContent } from "../../../components/components/ui/card";
import { TrendingUp, Users, Activity, Zap, Building2, Award } from "lucide-react";

export const StatCard = ({ label, value, trend, icon, color = "indigo" }) => {
    const getIcon = () => {
        switch (icon) {
            case 'users': return <Users size={20} />;
            case 'activity': return <Activity size={20} />;
            case 'zap': return <Zap size={20} />;
            case 'business': return <Building2 size={20} />;
            case 'award': return <Award size={20} />;
            default: return <Activity size={20} />;
        }
    };

    const colors = {
        indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        green: "bg-green-50 text-green-600 border-green-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
    };

    return (
        <Card className="border border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 rounded-xl overflow-hidden dark:hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 ${colors[color] || colors.indigo}`}>
                        {getIcon()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate leading-none mb-1">{label}</p>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F1626] dark:text-white tracking-tight leading-none">{value}</h3>
                            {trend && (
                                <div className="flex items-center gap-0.5 text-[9px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-100 dark:border-green-500/20">
                                    <TrendingUp size={8} />
                                    {trend}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
