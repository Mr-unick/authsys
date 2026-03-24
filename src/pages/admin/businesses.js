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
                <Loader2 className="animate-spin text-indigo-600 h-6 w-6" />
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Enterprise Directory</h1>
                    <p className="text-xs text-slate-400 mt-0.5">Manage and monitor all tenant businesses</p>
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
                    className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={16} /> Register Business
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {businesses.map((b) => (
                    <Card key={b.id} className="border border-slate-100 rounded-xl overflow-hidden hover:border-slate-200 transition-colors">
                        <CardContent className="p-0">
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <Building2 size={22} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => {
                                                setSubEditing(b);
                                                setShowSubModal(true);
                                            }}
                                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                            title="Manage Subscription"
                                        >
                                            <Shield size={15} />
                                        </button>
                                        <button onClick={() => openEdit(b)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <Edit2 size={15} />
                                        </button>
                                        <button onClick={() => deleteBusiness(b.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-slate-800 mb-1">{b.business_name}</h3>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mb-4">
                                    <MapPin size={11} /> {b.city}, {b.state}
                                </p>

                                <div className="space-y-3 pt-3 border-t border-slate-50">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-400 font-medium">Tenant Stats</span>
                                        <div className="flex gap-3">
                                            <span className="flex items-center gap-1 font-semibold text-indigo-600">
                                                <Users size={12} /> {b._count?.users || 0}
                                            </span>
                                            <span className="flex items-center gap-1 font-semibold text-emerald-600">
                                                <Target size={12} /> {b._count?.leads || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 rounded-lg p-3 flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Mail size={11} className="text-indigo-400" /> {b.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Phone size={11} className="text-indigo-400" /> {b.contact_number}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-5 py-3 bg-slate-800 text-white flex items-center justify-between overflow-hidden relative">
                                <div className="relative z-10">
                                    <p className="text-xs font-medium text-indigo-300 mb-0.5">Owner</p>
                                    <p className="text-xs font-semibold">{b.owner_name}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Business Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {editing ? 'Update Business' : 'Register New Business'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Provide accurate compliance and contact details.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-9 w-9 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-h-[60vh] overflow-y-auto px-1 scrollbar-hide mb-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Business Name</label>
                                    <input required type="text" value={formData.business_name} onChange={e => setFormData({ ...formData, business_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors font-medium" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Primary Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Contact Number</label>
                                    <input required type="text" value={formData.contact_number} onChange={e => setFormData({ ...formData, contact_number: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">GST Number</label>
                                    <input required type="text" value={formData.gst_number} onChange={e => setFormData({ ...formData, gst_number: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Owner Name</label>
                                    <input required type="text" value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Owner Email</label>
                                    <input required type="email" value={formData.owner_email} onChange={e => setFormData({ ...formData, owner_email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-semibold text-slate-600">Full Address</label>
                                    <textarea required rows={2} value={formData.business_address} onChange={e => setFormData({ ...formData, business_address: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">City</label>
                                    <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">State</label>
                                    <input required type="text" value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" />
                                </div>

                                {!editing && (
                                    <>
                                        <div className="md:col-span-2 pt-4 pb-1 border-t border-slate-100">
                                            <h4 className="text-sm font-bold text-indigo-600">Business Admin Account</h4>
                                            <p className="text-xs text-slate-400 mt-0.5">This account will be the primary administrator for the tenant.</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Admin Name</label>
                                            <input required type="text" value={formData.admin_name} onChange={e => setFormData({ ...formData, admin_name: e.target.value })} className="w-full bg-white border border-indigo-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors font-medium" placeholder="Full Name" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600">Portal Email</label>
                                            <input required type="email" value={formData.admin_email} onChange={e => setFormData({ ...formData, admin_email: e.target.value })} className="w-full bg-white border border-indigo-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" placeholder="admin@company.com" />
                                        </div>
                                        <div className="space-y-1.5 md:col-span-2">
                                            <label className="text-xs font-semibold text-slate-600">Secure Password</label>
                                            <input required type="password" value={formData.admin_password} onChange={e => setFormData({ ...formData, admin_password: e.target.value })} className="w-full bg-white border border-indigo-200 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors" placeholder="••••••••" />
                                        </div>
                                    </>
                                )}
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                {editing ? 'Save Changes' : 'Register Business'}
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                            <Shield size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Manage Features</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{business.business_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="h-9 w-9 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg flex items-center justify-center transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide space-y-6">
                    {/* Plan & Trial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <CreditCard size={12} className="text-indigo-500" /> Subscription Plan
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {['BASIC', 'PRO', 'ENTERPRISE', 'CUSTOM'].map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setData({ ...data, plan: p })}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${data.plan === p ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                                <Clock size={12} className="text-emerald-500" /> Free Trial Period
                            </label>
                            <select
                                value={data.trial_months}
                                onChange={e => setData({ ...data, trial_months: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                            >
                                <option value={0}>No Active Trial</option>
                                <option value={1}>1 Month Trial</option>
                                <option value={3}>3 Months Trial</option>
                                <option value={6}>6 Months Extended Trial</option>
                                <option value={12}>1 Year Full Trial</option>
                            </select>
                        </div>
                    </div>

                    {/* Limits */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Max Branches', key: 'max_branches' },
                            { label: 'Total Users', key: 'total_user_limit' },
                            { label: 'Max Stages', key: 'max_lead_stages' },
                            { label: 'Max Webhooks', key: 'max_webhooks' },
                        ].map(item => (
                            <div key={item.key} className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-600">{item.label}</label>
                                <input
                                    type="number"
                                    value={data[item.key]}
                                    onChange={e => setData({ ...data, [item.key]: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-500" /> Feature Access
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {featureList.map((f) => {
                                const active = data.features.includes(f.key);
                                return (
                                    <button
                                        key={f.key}
                                        onClick={() => toggleFeature(f.key)}
                                        className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-colors ${active ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-100 bg-white hover:border-slate-200'}`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {active ? <CheckCircle2 size={16} /> : <div className="h-2 w-2 bg-slate-300 rounded-full" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-semibold ${active ? 'text-indigo-700' : 'text-slate-600'}`}>{f.name}</p>
                                            <p className="text-xs text-slate-400 leading-tight mt-0.5">{f.description}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Configuration"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 bg-white text-slate-500 py-3 rounded-lg text-sm font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
