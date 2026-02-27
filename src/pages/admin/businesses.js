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
                    <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight">Enterprise Directory</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage and monitor all tenant businesses from one portal</p>
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
                    className="bg-[#0F1626] text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus size={18} /> Register New Business
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {businesses.map((b) => (
                    <Card key={b.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                        <Building2 size={28} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setSubEditing(b);
                                                setShowSubModal(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                                            title="Manage Subscription"
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button onClick={() => openEdit(b)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteBusiness(b.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-[#0F1626] mb-1">{b.business_name}</h3>
                                <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mb-4">
                                    <MapPin size={12} /> {b.city}, {b.state}
                                </p>

                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center justify-between text-[11px]">
                                        <span className="text-gray-400 font-bold uppercase tracking-tighter">Tenant Stats</span>
                                        <div className="flex gap-4">
                                            <span className="flex items-center gap-1 font-bold text-indigo-600">
                                                <Users size={12} /> {b._count?.users || 0}
                                            </span>
                                            <span className="flex items-center gap-1 font-bold text-emerald-600">
                                                <Target size={12} /> {b._count?.leads || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-3 flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                            <Mail size={12} className="text-indigo-400" /> {b.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                            <Phone size={12} className="text-indigo-400" /> {b.contact_number}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-[#0F1626] text-white flex items-center justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">Owner</p>
                                    <p className="text-xs font-bold">{b.owner_name}</p>
                                </div>
                                <Info size={40} className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#0F1626] tracking-tight">
                                    {editing ? 'Update Enterprise' : 'Register New Business'}
                                </h3>
                                <p className="text-xs text-gray-400 mt-1 font-medium">Please provide accurate compliance and contact details.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 bg-gray-50 text-gray-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto px-2 scrollbar-hide mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Business Name</label>
                                    <input required type="text" value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 font-bold" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Primary Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contact Number</label>
                                    <input required type="text" value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">GST Number</label>
                                    <input required type="text" value={formData.gst_number} onChange={e => setFormData({ ...formData, gst_number: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Owner Name</label>
                                    <input required type="text" value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Owner Email</label>
                                    <input required type="email" value={formData.owner_email} onChange={e => setFormData({ ...formData, owner_email: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Address</label>
                                    <textarea required rows={2} value={formData.business_address} onChange={e => setFormData({ ...formData, business_address: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">City</label>
                                    <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">State</label>
                                    <input required type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" />
                                </div>

                                {!editing && (
                                    <>
                                        <div className="md:col-span-2 pt-6 pb-2 border-t border-gray-100">
                                            <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest">Business Admin Account</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">This account will be the primary administrator for the tenant.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Admin Name</label>
                                            <input required type="text" value={formData.admin_name} onChange={e => setFormData({ ...formData, admin_name: e.target.value })} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 font-bold" placeholder="Full Name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Portal Email</label>
                                            <input required type="email" value={formData.admin_email} onChange={e => setFormData({ ...formData, admin_email: e.target.value })} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" placeholder="admin@company.com" />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Secure Password</label>
                                            <input required type="password" value={formData.admin_password} onChange={e => setFormData({ ...formData, admin_password: e.target.value })} className="w-full bg-white border-2 border-indigo-50 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100" placeholder="••••••••" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:scale-[0.99] active:scale-95">
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
        features: []
    });

    const featureList = [
        { key: 'ai_scoring', name: 'AI Lead Scoring', description: 'Intelligent lead behavior analysis & ranking' },
        { key: 'bulk_comm', name: 'Bulk Marketing', description: 'Mass Email/WhatsApp/SMS capabilities' },
        { key: 'adv_analytics', name: 'Advanced Analytics', description: 'Deep-dive performace dashboards' },
        { key: 'api_access', name: 'API & Webhooks', description: 'External integration & data sync' },
        { key: 'multi_office', name: 'Multi-Branch', description: 'Support for multiple office locations' },
        { key: 'audit_logs', name: 'Audit Logs', description: 'Full staff activity tracking' },
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
                features: d.features.map(f => f.feature_key)
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
        <div className="fixed inset-0 bg-[#0F1626]/80 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-[3rem] w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                <div className="p-10 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-5">
                        <div className="h-16 w-16 bg-[#0F1626] rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 rotate-3 group-hover:rotate-0 transition-transform">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[#0F1626] tracking-tight">Privilege Governance</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Tenant: {business.business_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-12 w-12 bg-white text-gray-400 hover:text-red-500 rounded-2xl flex items-center justify-center shadow-sm transition-all">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10 max-h-[70vh] overflow-y-auto scrollbar-hide">
                    {/* Plan Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <CreditCard size={12} className="text-indigo-500" /> Subscription Plan
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setData({ ...data, plan: p })}
                                        className={`px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${data.plan === p ? 'bg-[#0F1626] text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Clock size={12} className="text-emerald-500" /> Free Trial Period
                            </label>
                            <select
                                value={data.trial_months}
                                onChange={e => setData({ ...data, trial_months: e.target.value })}
                                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-100"
                            >
                                <option value={0}>No Active Trial</option>
                                <option value={1}>1 Month Trial</option>
                                <option value={3}>3 Months Trial</option>
                                <option value={6}>6 Months Extended Trial</option>
                                <option value={12}>1 Year Full Trial</option>
                            </select>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Sparkles size={12} className="text-amber-500" /> Premium Capability Matrix
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {featureList.map((f) => {
                                const active = data.features.includes(f.key);
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => toggleFeature(f.key)}
                                        className={`flex items-start gap-4 p-5 rounded-[2rem] border-2 text-left transition-all ${active ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 bg-white hover:border-gray-200'}`}
                                    >
                                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-400'}`}>
                                            {active ? <CheckCircle2 size={20} /> : <div className="h-2 w-2 bg-gray-300 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-black ${active ? 'text-indigo-900' : 'text-gray-600'}`}>{f.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium leading-tight mt-1">{f.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-gray-50/50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-[#0F1626] text-white py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:scale-[0.99] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        {saving ? <Loader2 className="animate-spin h-5 w-5" /> : "Deploy Configuration"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-10 bg-white text-gray-400 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-[0.2em] border border-gray-100 hover:bg-gray-50 transition-all font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
