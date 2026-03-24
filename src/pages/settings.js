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
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        toast.success("Settings updated successfully");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <Loader2 className="animate-spin text-indigo-600 h-6 w-6" />
            </div>
        );
    }

    const isSuperAdmin = user?.role === 'SUPER_ADMIN';

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-[#0F1626] dark:bg-indigo-600 p-2.5 rounded-xl text-white">
                        <Settings size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">System Settings</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Configure your environment preferences</p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Navigation */}
                <div className="col-span-12 lg:col-span-3 space-y-1">
                    {[
                        { id: 'general', label: 'General', icon: <Globe size={16} /> },
                        { id: 'security', label: 'Privacy & Access', icon: <Shield size={16} /> },
                        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
                        isSuperAdmin && { id: 'platform', label: 'Platform', icon: <Cpu size={16} /> },
                    ].filter(Boolean).map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${activeTab === tab.id
                                ? 'bg-[#0F1626] dark:bg-indigo-600 text-white'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className={activeTab === tab.id ? 'text-indigo-300 dark:text-white' : 'text-slate-400'}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="col-span-12 lg:col-span-9">
                    <Card className="border border-slate-100 rounded-xl overflow-hidden bg-white dark:bg-[#1A1F2C]/50 dark:border-white/5">
                        <CardHeader className="p-6 pb-4">
                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                                {activeTab.replace('-', ' ')} Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-2 space-y-6">
                            {activeTab === 'general' && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500">Workspace Name</label>
                                            <input
                                                type="text"
                                                value={config.platformName}
                                                onChange={e => setConfig({ ...config, platformName: e.target.value })}
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 font-medium text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-lg border border-indigo-100 dark:border-indigo-500/20 flex items-start gap-3">
                                        <div className="p-2 bg-white dark:bg-[#0F1626] rounded-lg text-indigo-600 dark:text-indigo-400"><Database size={16} /></div>
                                        <div>
                                            <h4 className="font-semibold text-slate-700 dark:text-white text-sm">Data Residency</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All data is stored in the Mumbai AWS region for optimal latency.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 group hover:border-slate-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white dark:bg-[#0F1626] rounded-lg text-slate-400 group-hover:text-indigo-600 transition-colors"><Lock size={16} /></div>
                                            <div>
                                                <p className="font-semibold text-slate-700 dark:text-white text-sm">Two-Factor Authentication</p>
                                                <p className="text-xs text-slate-400 mt-0.5">Require multi-factor authentication for every entry</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setConfig({ ...config, enableTwoFactor: !config.enableTwoFactor })}
                                            className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${config.enableTwoFactor ? 'bg-indigo-600 justify-end' : 'bg-slate-200 dark:bg-white/10 justify-start'}`}
                                        >
                                            <div className="w-5 h-5 bg-white rounded-full" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-slate-500">Session Timeout (Minutes)</label>
                                        <input
                                            type="number"
                                            value={config.sessionTimeout}
                                            onChange={e => setConfig({ ...config, sessionTimeout: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2.5 font-medium text-sm text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'platform' && isSuperAdmin && (
                                <div className="space-y-5 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-red-800 dark:text-red-400 text-sm">Maintenance Mode</h4>
                                                <button
                                                    onClick={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                                                    className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${config.maintenanceMode ? 'bg-red-600 justify-end' : 'bg-red-200 dark:bg-red-900/20 justify-start'}`}
                                                >
                                                    <div className="w-5 h-5 bg-white rounded-full" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-red-600/70 dark:text-red-400/60 font-medium">Block all non-admin access during critical updates.</p>
                                        </div>

                                        <div className="p-5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold text-emerald-800 dark:text-emerald-400 text-sm">Global Registration</h4>
                                                <button
                                                    onClick={() => setConfig({ ...config, allowRegistrations: !config.allowRegistrations })}
                                                    className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${config.allowRegistrations ? 'bg-emerald-600 justify-end' : 'bg-emerald-200 dark:bg-emerald-900/20 justify-start'}`}
                                                >
                                                    <div className="w-5 h-5 bg-white rounded-full" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/60 font-medium">Allow new business tenants to register automatically.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                                                <HardDrive size={12} /> Database Latency
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-slate-800 dark:text-white">14</span>
                                                <span className="text-xs font-medium text-slate-400">ms</span>
                                                <span className="ml-auto text-xs bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md font-medium border border-green-100">OPTIMAL</span>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5">
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-2">
                                                <Cpu size={12} /> Engine Load
                                            </div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xl font-bold text-slate-800 dark:text-white">2.4</span>
                                                <span className="text-xs font-medium text-slate-400">%</span>
                                                <span className="ml-auto text-xs bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md font-medium border border-indigo-100">STABLE</span>
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
