import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Building2, Plus, Search, MapPin, Phone, Mail,
    MoreVertical, Edit2, Trash2, Users, Target, Loader2, X, Info, Shield, CheckCircle2, Clock, Sparkles, CreditCard
} from 'lucide-react';
import { Card, CardContent } from '@/components/components/ui/card';

export default function BusinessesPage() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showSubModal, setShowSubModal] = useState(false);
    const [subEditing, setSubEditing] = useState(null);
    const [formData, setFormData] = useState({
        business_name: '',
        gst_number: '',
        pan_number: '',
        business_address: '',
        city: '',
        state: '',
        pin_code: '',
        contact_number: '',
        email: '',
        owner_name: '',
        owner_contact: '',
        owner_email: '',
        admin_name: '',
        admin_email: '',
        admin_password: '',
    });

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/businesses');
            setBusinesses(res.data.data);
        } catch (err) {
            toast.error("Failed to load businesses");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put('/api/admin/businesses', { ...formData, id: editing.id });
                toast.success("Business updated");
            } else {
                await axios.post('/api/admin/businesses', formData);
                toast.success("Business registered successfully");
            }
            setShowModal(false);
            setEditing(null);
            fetchBusinesses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const deleteBusiness = async (id) => {
        if (!confirm("Are you sure? This will soft-delete the business.")) return;
        try {
            await axios.delete(`/api/admin/businesses?id=${id}`);
            toast.success("Business deleted");
            fetchBusinesses();
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const openEdit = (b) => {
        setEditing(b);
        setFormData(b);
        setShowModal(true);
    };

    if (loading && !businesses.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-8 pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Enterprise Directory</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage and monitor all tenant businesses from one portal</p>
                </div>
                <button
                    onClick={() => {
                        setEditing(null);
                        setFormData({
                            business_name: '', gst_number: '', pan_number: '', business_address: '',
                            city: '', state: '', pin_code: '', contact_number: '', email: '',
                            owner_name: '', owner_contact: '', owner_email: '',
                            admin_name: '', admin_email: '', admin_password: '',
                        });
                        setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2.5 shadow-sm"
                >
                    <Plus size={18} /> Register New Business
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((b) => (
                    <Card key={b.id} className="border border-slate-100 shadow-sm rounded-xl overflow-hidden group hover:shadow-md transition-all duration-300 bg-white">
                        <CardContent className="p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                                        <Building2 size={24} />
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => {
                                                setSubEditing(b);
                                                setShowSubModal(true);
                                            }}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                                            title="Manage Subscription"
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button onClick={() => openEdit(b)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteBusiness(b.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{b.business_name}</h3>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mb-5">
                                    <MapPin size={12} className="text-slate-300" /> {b.city}, {b.state}
                                </p>

                                <div className="space-y-4 pt-5 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tenant Stats</span>
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                                                <Users size={12} /> {b._count?.users || 0}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                                <Target size={12} /> {b._count?.leads || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100/50 rounded-xl p-3.5 space-y-2.5">
                                        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                                            <Mail size={13} className="text-slate-400 shrink-0" /> <span className="truncate">{b.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-600">
                                            <Phone size={13} className="text-slate-400 shrink-0" /> {b.contact_number}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between relative overflow-hidden">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Business Owner</p>
                                    <p className="text-sm font-semibold text-slate-700">{b.owner_name}</p>
                                </div>
                                <div className="absolute right-[-4px] bottom-[-4px] opacity-10 bg-indigo-600/5 p-4 rounded-full">
                                    <Info size={32} className="text-indigo-600 rotate-12" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-xl border border-slate-100 flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editing ? 'Update Enterprise' : 'Register New Business'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1 font-medium">Please provide accurate compliance and contact details.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-9 w-9 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Business Name</label>
                                    <input required type="text" value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Primary Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Contact Number</label>
                                    <input required type="text" value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">GST Number</label>
                                    <input required type="text" value={formData.gst_number} onChange={e => setFormData({ ...formData, gst_number: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Owner Name</label>
                                    <input required type="text" value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Owner Email</label>
                                    <input required type="email" value={formData.owner_email} onChange={e => setFormData({ ...formData, owner_email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">Full Address</label>
                                    <textarea required rows={2} value={formData.business_address} onChange={e => setFormData({ ...formData, business_address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors resize-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">City</label>
                                    <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600 px-0.5">State</label>
                                    <input required type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>

                                {!editing && (
                                    <>
                                        <div className="md:col-span-2 pt-5 pb-1 border-t border-slate-100 mt-2">
                                            <h4 className="text-sm font-bold text-indigo-600">Business Admin Account</h4>
                                            <p className="text-[11px] text-slate-400 font-medium">This account will be the primary administrator for the tenant.</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600 px-0.5">Admin Name</label>
                                            <input required type="text" value={formData.admin_name} onChange={e => setFormData({ ...formData, admin_name: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" placeholder="Full Name" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600 px-0.5">Portal Email</label>
                                            <input required type="email" value={formData.admin_email} onChange={e => setFormData({ ...formData, admin_email: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" placeholder="admin@company.com" />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600 px-0.5">Secure Password</label>
                                            <input required type="password" value={formData.admin_password} onChange={e => setFormData({ ...formData, admin_password: e.target.value })} className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" placeholder="••••••••" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">
                                {editing ? 'Apply Updates' : 'Confirm Registration'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {showSubModal && subEditing && (
                <SubscriptionModal
                    business={subEditing}
                    onClose={() => {
                        setShowSubModal(false);
                        setSubEditing(null);
                    }}
                    onSuccess={() => {
                        setShowSubModal(false);
                        setSubEditing(null);
                        fetchBusinesses();
                    }}
                />
            )}
        </div>
    );
}

function SubscriptionModal({ business, onClose, onSuccess }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState({
        plan: 'BASIC',
        status: 'ACTIVE',
        trial_months: 0,
        features: [],
        max_branches: 1,
        total_user_limit: 10,
        max_lead_stages: 5,
        max_webhooks: 1
    });

    const featureList = [
        { key: 'custom_lead_stages', name: 'Custom Lead Stages', description: 'Modify and create custom pipeline stages and colors' },
        { key: 'area_of_operations', name: 'Area of Operations', description: 'Define and manage regions, zones, and sales areas' },
        { key: 'multi_branch', name: 'Multi-Branch Management', description: 'Support for multiple office locations and branches' },
        { key: 'bulk_comm', name: 'Bulk Communications', description: 'Mass WhatsApp & Bulk SMTP Email capabilities' },
        { key: 'integration_suite', name: 'Integration Suite', description: 'Access to the core integrations and API dashboard' },
        { key: 'integration_whatsapp', name: 'WhatsApp Business', description: 'Automated WhatsApp alerts and communication' },
        { key: 'integration_facebook', name: 'Facebook Lead Ads', description: 'Real-time sync with Meta Ads Manager' },
        { key: 'integration_linkedin', name: 'LinkedIn Lead Ads', description: 'Automated polling for LinkedIn Form submissions' },
        { key: 'integration_custom_webhook', name: 'Custom Webhooks', description: 'Generic endpoints (Limited to essential sync)' },
        { key: 'support_system', name: 'Premium Support Desk', description: 'Internal ticketing system for technical & billing help' },
        { key: 'activity_log', name: 'Activity Logging', description: 'Real-time event stream and historical member actions' },
    ];

    useEffect(() => {
        fetchSubData();
    }, []);

    const fetchSubData = async () => {
        try {
            const res = await axios.get(`/api/admin/subscription?business_id=${business.id}`);
            const d = res.data.data;
            setData({
                plan: d.plan || 'BASIC',
                status: d.status || 'ACTIVE',
                trial_months: 0,
                features: d.features.map(f => f.feature_key),
                max_branches: d.max_branches || 1,
                total_user_limit: d.total_user_limit || 10,
                max_lead_stages: d.max_lead_stages || 5,
                max_webhooks: d.max_webhooks || 1
            });
        } catch (err) {
            toast.error("Failed to load subscription data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await axios.post('/api/admin/subscription', {
                business_id: business.id,
                ...data
            });
            toast.success("Subscription updated");
            onSuccess();
        } catch (err) {
            toast.error("Failed to update");
        } finally {
            setSaving(false);
        }
    };

    const toggleFeature = (key) => {
        setData(prev => ({
            ...prev,
            features: prev.features.includes(key)
                ? prev.features.filter(f => f !== key)
                : [...prev.features, key]
        }));
    };

    if (loading) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-300 border border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm transition-transform">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Privilege Governance</h3>
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Tenant: {business.business_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-9 w-9 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-all">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Plan Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <CreditCard size={12} className="text-indigo-500" /> Subscription Plan
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setData({ ...data, plan: p })}
                                        className={`px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all border ${data.plan === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <Clock size={12} className="text-emerald-500" /> Free Trial Period
                            </label>
                            <select
                                value={data.trial_months}
                                onChange={e => setData({ ...data, trial_months: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            >
                                <option value={0}>No Active Trial</option>
                                <option value={1}>1 Month Trial</option>
                                <option value={3}>3 Months Trial</option>
                                <option value={6}>6 Months Extended Trial</option>
                                <option value={12}>1 Year Full Trial</option>
                            </select>
                        </div>
                    </div>

                    {/* Granular Limits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Max Branches</label>
                            <input
                                type="number"
                                value={data.max_branches}
                                onChange={e => setData({ ...data, max_branches: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Total Users</label>
                            <input
                                type="number"
                                value={data.total_user_limit}
                                onChange={e => setData({ ...data, total_user_limit: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Max Stages</label>
                            <input
                                type="number"
                                value={data.max_lead_stages}
                                onChange={e => setData({ ...data, max_lead_stages: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Max Webhooks</label>
                            <input
                                type="number"
                                value={data.max_webhooks}
                                onChange={e => setData({ ...data, max_webhooks: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                            <Sparkles size={12} className="text-amber-500" /> Premium Capability Matrix
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                            {featureList.map((f) => {
                                const active = data.features.includes(f.key);
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => toggleFeature(f.key)}
                                        className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all text-left group/feat ${active ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/30'}`}
                                    >
                                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                                            {active ? <CheckCircle2 size={18} /> : <div className="h-1.5 w-1.5 bg-slate-200 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-bold ${active ? 'text-indigo-900' : 'text-slate-700 group-hover/feat:text-slate-900'}`}>{f.name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium leading-tight mt-0.5">{f.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Deploy Configuration"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 bg-white text-slate-500 py-3 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-all"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
