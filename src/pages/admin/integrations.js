import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Zap, Facebook, Linkedin, Globe, CheckCircle2, XCircle,
    AlertCircle, RefreshCw, Trash2, Search, Filter,
    Building2, Activity, Link2, ExternalLink, Loader2, Gauge, ShieldAlert
} from 'lucide-react';
import { Card, CardContent } from '@/components/components/ui/card';

const PROVIDER_ICONS = {
    meta: <Facebook size={18} className="text-blue-600" />,
    facebook: <Facebook size={18} className="text-blue-600" />,
    linkedin: <Linkedin size={18} className="text-blue-700" />,
    custom: <Globe size={18} className="text-indigo-600" />,
    whatsapp: <Zap size={18} className="text-emerald-500" />,
    email: <Zap size={18} className="text-blue-500" />,
};

export default function AdminIntegrationsPage() {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchIntegrations();
    }, []);

    const fetchIntegrations = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/integrations');
            setIntegrations(res.data.data);
        } catch (err) {
            toast.error("Failed to load integrations");
        } finally {
            setLoading(false);
        }
    };

    const revokeIntegration = async (id) => {
        if (!confirm("Are you sure? This will permanently revoke this integration for the tenant.")) return;
        try {
            await axios.delete(`/api/admin/integrations?id=${id}`);
            toast.success("Integration revoked");
            fetchIntegrations();
        } catch (err) {
            toast.error("Revocation failed");
        }
    };

    const filtered = integrations.filter(i => {
        const matchesSearch = i.business_name?.toLowerCase().includes(search.toLowerCase()) ||
            i.display_name?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || i.provider === filter || i.status === filter;
        return matchesSearch && matchesFilter;
    });

    if (loading && !integrations.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight flex items-center gap-3">
                        <Activity className="text-indigo-600" /> Integration Observer
                    </h1>
                    <p className="text-sm text-gray-500 font-medium mt-1">Global synchronization health across all tenant businesses</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search by business or integration..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white border border-gray-100 rounded-2xl px-5 py-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all shadow-sm"
                    >
                        <option value="all">All Providers</option>
                        <option value="meta">Meta / Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="custom">Webhooks</option>
                        <option value="connected">Active Only</option>
                        <option value="error">Error Only</option>
                    </select>

                    <button
                        onClick={fetchIntegrations}
                        className="p-3.5 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((i) => (
                    <Card key={i.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 bg-white">
                        <CardContent className="p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner ${i.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {PROVIDER_ICONS[i.provider] || <Globe size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-[#0F1626] leading-none mb-1.5">{i.display_name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                <Building2 size={10} className="text-indigo-400" /> {i.business_name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => revokeIntegration(i.id)}
                                        className="p-2.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        title="Revoke Integration"
                                    >
                                        <ShieldAlert size={18} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-transparent hover:border-indigo-50 transition-all">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <Zap size={10} className="text-amber-500" /> Leads Today
                                        </p>
                                        <p className="text-xl font-black text-[#0F1626]">{i.leads_today}</p>
                                    </div>
                                    <div className="bg-gray-50/50 rounded-2xl p-4 border border-transparent hover:border-indigo-50 transition-all">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                            <RefreshCw size={10} className="text-indigo-400" /> Last Sync
                                        </p>
                                        <p className="text-[11px] font-bold text-[#0F1626] mt-1.5">
                                            {i.last_sync ? new Date(i.last_sync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${i.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{i.status}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] font-bold text-gray-400">ID:</span>
                                            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">#{i.id}</span>
                                        </div>
                                    </div>

                                    {i.last_sync_status && (
                                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold ${i.last_sync_status === 'success' ? 'bg-emerald-50/50 text-emerald-700' : 'bg-red-50/50 text-red-700'
                                            }`}>
                                            {i.last_sync_status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                            Last sync: {i.last_sync_status.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between group-hover:bg-[#0F1626] transition-colors duration-500">
                                <div className="flex items-center gap-2">
                                    <Activity size={14} className="text-indigo-400 group-hover:text-indigo-300" />
                                    <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300">Live Telemetry Active</span>
                                </div>
                                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline group-hover:text-white transition-all flex items-center gap-1">
                                    Open Terminal <ExternalLink size={10} />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-6">
                            <Link2 size={40} />
                        </div>
                        <h3 className="text-xl font-black text-[#0F1626]">No matching integrations</h3>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>

            {/* Legend / Stats Footer */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Connections', value: integrations.length, icon: <Link2 />, color: 'text-indigo-600' },
                    { label: 'Healthy Systems', value: integrations.filter(i => i.status === 'connected').length, icon: <CheckCircle2 />, color: 'text-emerald-600' },
                    { label: 'Attention Required', value: integrations.filter(i => i.status !== 'connected').length, icon: <AlertCircle />, color: 'text-red-600' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm flex items-center gap-5 border border-transparent hover:border-indigo-50 transition-all">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center bg-gray-50 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                            <p className="text-2xl font-black text-[#0F1626]">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
