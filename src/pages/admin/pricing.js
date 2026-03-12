import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Tag, Plus, Trash2, Save, Loader2, GitBranch, Users,
    Layers, Zap, MessageSquare, ShieldCheck, Info
} from 'lucide-react';

export default function PricingConfigPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState(null);

    // Default structure matching landing page requirements
    const defaultConfig = {
        BASE_PRICE: 999,
        TIER_FEATURES: [
            {
                id: 'branches',
                name: 'Branch Count',
                desc: 'Number of business branches / locations.',
                tiers: [
                    { label: '1 Branch', price: 0, value: 1 },
                    { label: '3 Branches', price: 799, value: 3 },
                    { label: '10 Branches', price: 1999, value: 10 },
                    { label: 'Unlimited', price: 3999, value: 9999 },
                ]
            },
            {
                id: 'users',
                name: 'User Limit',
                desc: 'Team members / sales agents on your account.',
                tiers: [
                    { label: '3 Users', price: 0, value: 3 },
                    { label: '10 Users', price: 699, value: 10 },
                    { label: '25 Users', price: 1499, value: 25 },
                    { label: 'Unlimited', price: 2999, value: 9999 },
                ]
            },
            {
                id: 'stages',
                name: 'Custom Lead Stages',
                desc: 'Pipeline stages tailored to your sales process.',
                tiers: [
                    { label: '5 Stages', price: 0, value: 5 },
                    { label: '15 Stages', price: 399, value: 15 },
                    { label: 'Unlimited', price: 799, value: 9999 },
                ]
            },
            {
                id: 'webhooks',
                name: 'Webhooks',
                desc: 'Outbound webhooks to connect with external apps.',
                tiers: [
                    { label: '3 Webhooks', price: 0, value: 3 },
                    { label: '10 Webhooks', price: 399, value: 10 },
                    { label: 'Unlimited', price: 799, value: 9999 },
                ]
            }
        ],
        TOGGLE_FEATURES: [
            { id: 'fb', name: 'Facebook Lead Sync', price: 799 },
            { id: 'insta', name: 'Instagram Lead Sync', price: 799 },
            { id: 'linkedin', name: 'LinkedIn Lead Gen', price: 999 },
            { id: 'whatsapp', name: 'WhatsApp Notifications', price: 599 },
        ]
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await axios.get('/api/admin/global-config?key=pricing_matrix');
            if (res.data.data) {
                setConfig(res.data.data.value);
            } else {
                setConfig(defaultConfig);
            }
        } catch (err) {
            toast.error("Failed to load pricing config");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/admin/global-config', {
                key: 'pricing_matrix',
                value: config
            });
            toast.success("Pricing configuration deployed live!");
        } catch (err) {
            toast.error("Cloud deployment failed");
        } finally {
            setSaving(false);
        }
    };

    const updateTierPrice = (featureId, tierIndex, newPrice) => {
        const newConfig = { ...config };
        const feature = newConfig.TIER_FEATURES.find(f => f.id === featureId);
        feature.tiers[tierIndex].price = parseInt(newPrice) || 0;
        setConfig(newConfig);
    };

    const updateFeaturePrice = (featureId, newPrice) => {
        const newConfig = { ...config };
        const feature = newConfig.TOGGLE_FEATURES.find(f => f.id === featureId);
        feature.price = parseInt(newPrice) || 0;
        setConfig(newConfig);
    };

    const updateBasePrice = (newPrice) => {
        setConfig({ ...config, BASE_PRICE: parseInt(newPrice) || 0 });
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 pb-40 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                            <Tag className="text-white" size={24} />
                        </div>
                        Revenue & Pricing Control
                    </h1>
                    <p className="text-sm text-slate-400 font-medium mt-1">Configure live pricing matrix for the landing page builder.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#0F1626] text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Deploy Live Changes
                </button>
            </div>

            {/* Base Price Card */}
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                        <ShieldCheck size={28} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Base Platform Fee</h3>
                        <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-widest mt-0.5">Core CRM Access & Infrastructure</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <span className="text-lg font-black text-slate-800 ml-4">₹</span>
                    <input
                        type="number"
                        value={config.BASE_PRICE}
                        onChange={(e) => updateBasePrice(e.target.value)}
                        className="w-32 bg-transparent border-none text-2xl font-black text-indigo-600 focus:ring-0 p-0 text-right pr-4"
                    />
                    <span className="text-xs font-bold text-slate-400 mr-4">/ mo</span>
                </div>
            </div>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {config.TIER_FEATURES.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:border-indigo-100 transition-colors">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                                {feature.id === 'branches' && <GitBranch size={16} className="text-indigo-600" />}
                                {feature.id === 'users' && <Users size={16} className="text-blue-600" />}
                                {feature.id === 'stages' && <Layers size={16} className="text-violet-600" />}
                                {feature.id === 'webhooks' && <Zap size={16} className="text-amber-600" />}
                            </div>
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{feature.name}</h4>
                        </div>
                        <div className="p-6 space-y-4">
                            {feature.tiers.map((tier, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-indigo-100 transition-all">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{tier.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-slate-400">₹</span>
                                        <input
                                            type="number"
                                            value={tier.price}
                                            onChange={(e) => updateTierPrice(feature.id, idx, e.target.value)}
                                            className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-black text-slate-800 focus:ring-2 focus:ring-indigo-100 text-right"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toggles Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-emerald-600">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Add-on Integrations</h3>
                            <p className="text-xs text-slate-400 font-medium">Flat monthly fees for third-party connector tools.</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {config.TOGGLE_FEATURES.map((feature) => (
                        <div key={feature.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-50 hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all duration-300">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-indigo-600 border border-slate-100">
                                    {feature.id === 'fb' ? 'f' : feature.id === 'insta' ? 'IG' : feature.id === 'linkedin' ? 'in' : 'WA'}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-tight">{feature.name}</p>
                                </div>
                                <div className="flex items-center gap-1.5 w-full bg-white p-2 rounded-xl border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-300">₹</span>
                                    <input
                                        type="number"
                                        value={feature.price}
                                        onChange={(e) => updateFeaturePrice(feature.id, e.target.value)}
                                        className="w-full bg-transparent border-none text-sm font-black text-slate-800 p-0 text-center focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Message */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex gap-4">
                <Info className="text-indigo-600 shrink-0" size={20} />
                <p className="text-xs text-indigo-800 font-medium leading-relaxed">
                    Changes made here are applied instantly to the pricing calculator on the public landing page.
                    This does not automatically update existing customer bills, but new calculations will use these rates.
                </p>
            </div>
        </div>
    );
}
