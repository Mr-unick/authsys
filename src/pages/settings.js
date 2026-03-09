import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Settings, Shield, Bell, Globe, Save, Loader2,
    Lock, Check, Palette, Database, HardDrive, Cpu
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [saving, setSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Mock settings state
    const [config, setConfig] = useState({
        platformName: 'LeadConverter Pro',
        maintenanceMode: false,
        allowRegistrations: true,
        sessionTimeout: 60,
        enableTwoFactor: false,
        emailNotifications: true,
        pushNotifications: true,
    });

    useEffect(() => {
        setMounted(true);
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/auth/isauthenticated');
                setUser(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        toast.success("System configurations updated successfully");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-12 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="bg-[#0F1626] dark:bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-gray-200 dark:shadow-none text-white">
                        <Settings size={28} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-[#0F1626] dark:text-white tracking-tight">System Settings</h1>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your environment preferences</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Synchronize Changes
                </button>
            </div>

            <div className="grid grid-cols-12 gap-10">
                {/* Navigation */}
                <div className="col-span-12 lg:col-span-3 space-y-2">
                    {[
                        { id: 'general', label: 'General', icon: <Globe size={18} /> },
                        { id: 'security', label: 'Privacy & Access', icon: <Shield size={18} /> },
                        { id: 'notifications', label: 'Alert Signals', icon: <Bell size={18} /> },
                        isSuperAdmin && { id: 'platform', label: 'Platform Engine', icon: <Cpu size={18} /> },
                    ].filter(Boolean).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-sm ${activeTab === tab.id
                                ? 'bg-[#0F1626] dark:bg-indigo-600 text-white shadow-2xl shadow-gray-300 dark:shadow-none scale-[1.02] z-10'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className={activeTab === tab.id ? 'text-indigo-400 dark:text-white' : 'text-gray-400'}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9">
                    <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#1A1F2C]/50 border border-gray-50 dark:border-white/5 backdrop-blur-xl">
                        <CardHeader className="p-10 pb-4">
                            <CardTitle className="text-2xl font-black text-[#0F1626] dark:text-white tracking-tight capitalize">
                                {activeTab.replace('-', ' ')} Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 pt-6 space-y-10">
                            {activeTab === 'general' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Workspace Identity</label>
                                            <input
                                                type="text"
                                                value={config.platformName}
                                                onChange={e => setConfig({ ...config, platformName: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 font-bold text-[#0F1626] dark:text-white focus:ring-2 focus:ring-indigo-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-4">
                                        <div className="p-3 bg-white dark:bg-[#0F1626] rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm"><Database size={20} /></div>
                                        <div>
                                            <h4 className="font-bold text-[#0F1626] dark:text-white text-sm">Data Residency</h4>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 font-medium italic">All your business intelligence is currently stored in the Mumbai AWS region for optimal latency.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5 group hover:border-indigo-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white dark:bg-[#0F1626] rounded-2xl text-gray-400 group-hover:text-indigo-600 transition-colors shadow-sm"><Lock size={20} /></div>
                                            <div>
                                                <p className="font-bold text-[#0F1626] dark:text-white">Biometric/2FA Challenge</p>
                                                <p className="text-xs text-gray-400 font-medium">Require multi-factor authentication for every entry</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfig({ ...config, enableTwoFactor: !config.enableTwoFactor })}
                                            className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${config.enableTwoFactor ? 'bg-indigo-600 justify-end' : 'bg-gray-200 dark:bg-white/10 justify-start'}`}
                                        >
                                            <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Session Expiration (Minutes)</label>
                                        <input
                                            type="number"
                                            value={config.sessionTimeout}
                                            onChange={e => setConfig({ ...config, sessionTimeout: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 font-bold text-[#0F1626] dark:text-white focus:ring-2 focus:ring-indigo-100 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'platform' && isSuperAdmin && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-8 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-[2rem] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-red-900 dark:text-red-400 text-sm uppercase tracking-tighter">Maintenance Mode</h4>
                                                <button
                                                    onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                                                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${config.maintenanceMode ? 'bg-red-600 justify-end' : 'bg-red-200 dark:bg-red-900/20 justify-start'}`}
                                                >
                                                    <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-red-700/70 dark:text-red-400/60 font-bold leading-relaxed">Instantly block all non-admin entry while performing critical engine updates.</p>
                                        </div>

                                        <div className="p-8 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-[2rem] space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-black text-emerald-900 dark:text-emerald-400 text-sm uppercase tracking-tighter">Global Registration</h4>
                                                <button
                                                    onClick={() => setConfig({ ...config, allowRegistrations: !config.allowRegistrations })}
                                                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${config.allowRegistrations ? 'bg-emerald-600 justify-end' : 'bg-emerald-200 dark:bg-emerald-900/20 justify-start'}`}
                                                >
                                                    <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 font-bold leading-relaxed">Allow new business tenants to board the platform automatically.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 pt-6">
                                        <div className="flex-1 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                <HardDrive size={12} /> Database Latency
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-[#0F1626] dark:text-white">14</span>
                                                <span className="text-xs font-bold text-gray-400">ms</span>
                                                <span className="ml-auto text-[10px] bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold">OPTIMAL</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                <Cpu size={12} /> Engine Load
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-black text-[#0F1626] dark:text-white">2.4</span>
                                                <span className="text-xs font-bold text-gray-400">%</span>
                                                <span className="ml-auto text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">STABLE</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
};

export default SettingsPage;
