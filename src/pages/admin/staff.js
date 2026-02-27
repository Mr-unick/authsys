import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Users, Plus, Search, Mail, Shield, UserCheck,
    MoreVertical, Edit2, Trash2, Loader2, X, Fingerprint, Lock
} from 'lucide-react';
import { Card, CardContent } from '@/components/components/ui/card';

export default function StaffManagementPage() {
    const [staff, setStaff] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role_id: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [staffRes, rolesRes] = await Promise.all([
                axios.get('/api/admin/staff'),
                axios.get('/api/getRoleProps') // This will fetch portal roles because user.business is null
            ]);
            setStaff(staffRes.data.data);
            setRoles(rolesRes.data.data.data || []); // Roles structure is sometimes nested in GenerateTable output
        } catch (err) {
            toast.error("Failed to load platform data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put('/api/admin/staff', { ...formData, id: editing.id });
                toast.success("Staff profile updated");
            } else {
                await axios.post('/api/admin/staff', formData);
                toast.success("Staff member registered successfully");
            }
            setShowModal(false);
            setEditing(null);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    const deleteStaff = async (id) => {
        if (!confirm("Remove this staff member? This action cannot be undone.")) return;
        try {
            await axios.delete(`/api/admin/staff?id=${id}`);
            toast.success("Staff member removed");
            fetchData();
        } catch (err) {
            toast.error("Deletion failed");
        }
    };

    const openEdit = (s) => {
        setEditing(s);
        setFormData({
            name: s.name,
            email: s.email,
            password: '', // Don't show password
            role_id: s.role_id || '',
        });
        setShowModal(true);
    };

    if (loading && !staff.length) {
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
                    <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight">Portal Staff</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage the team responsible for platform operations and support</p>
                </div>
                <button
                    onClick={() => {
                        setEditing(null);
                        setFormData({ name: '', email: '', password: '', role_id: '' });
                        setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus size={18} /> Register Staff Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {staff.map((s) => (
                    <Card key={s.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="h-12 w-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                                        <Fingerprint size={24} />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openEdit(s)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => deleteStaff(s.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-[#0F1626] mb-1">{s.name}</h3>
                                <div className="flex items-center gap-1.5 mb-4">
                                    <div className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-md border border-indigo-100">
                                        {s.role?.name || 'Full Access'}
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                        <Mail size={12} className="text-gray-300" /> {s.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500">
                                        <Shield size={12} className="text-gray-300" /> System Personnel
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Joined {new Date(s.created_at).toLocaleDateString()}</span>
                                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-[#0F1626] text-white">
                            <div>
                                <h3 className="text-xl font-bold tracking-tight">
                                    {editing ? 'Update Staff Member' : 'Register System Staff'}
                                </h3>
                                <p className="text-xs text-indigo-300 mt-1">Configure platform access and identity.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-10 w-10 bg-white/10 text-white/50 hover:text-white rounded-full flex items-center justify-center transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                                <div className="relative">
                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-100 font-bold" placeholder="E.g. John Support" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Identity (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-100" placeholder="staff@portal.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Portal Role</label>
                                <select
                                    value={formData.role_id}
                                    onChange={e => setFormData({ ...formData, role_id: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-4 text-sm focus:ring-2 focus:ring-indigo-100 font-bold appearance-none cursor-pointer"
                                >
                                    <option value="">Full Admin Access (No Restricted Role)</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Security Code (Password)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input
                                        type="password"
                                        required={!editing}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-100"
                                        placeholder={editing ? "Leave blank to keep current" : "Minimum 8 characters"}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:scale-[0.98]">
                                {editing ? 'Finalize Updates' : 'Authorize Entry'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
