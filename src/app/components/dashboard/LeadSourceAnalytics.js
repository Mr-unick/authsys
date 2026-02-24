import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Loader2, PieChart, TrendingUp, BarChart3 } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function LeadSourceAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/integrations/analytics');
                setData(res.data);
            } catch (err) {
                console.error('Failed to fetch lead source analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <Card className="border-none shadow-sm rounded-2xl h-[400px] flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            </Card>
        );
    }

    const pieData = data?.byProvider?.filter(p => p.status === 'imported').map(p => ({
        name: p.provider === 'meta' ? 'Meta' : p.provider === 'linkedin' ? 'LinkedIn' : 'Custom',
        value: p._count.id
    })) || [];

    const trendData = data?.dailyTrend || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <PieChart size={16} className="text-indigo-600" />
                        Leads by Source
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <RePieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                            </RePieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BarChart3 size={40} className="mb-2 opacity-20" />
                            <p className="text-xs uppercase tracking-widest font-bold">No Data Yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="border-none shadow-sm rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <TrendingUp size={16} className="text-indigo-600" />
                        Import Trend (30d)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    {trendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="day"
                                    fontSize={10}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BarChart3 size={40} className="mb-2 opacity-20" />
                            <p className="text-xs uppercase tracking-widest font-bold">No Data Yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
