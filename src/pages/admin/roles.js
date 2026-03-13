import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    ShieldAlert, Plus, ShieldCheck, Lock,
    MoreVertical, Edit2, Trash2, Loader2, X, Fingerprint,
    ChevronRight, CheckCircle2, Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';

export default function PortalRolesPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        selectedPermissions: [],
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch roles and ALL available permissions in the system
            const [rolesRes, permRes] = await Promise.all([
                axios.get('/api/getRoleProps'),
                axios.get('/api/getPolicyProps') // This usually returns permission structures
            ]);

            // Correctly map the table rows from GenerateTable structure
            setRoles(rolesRes.data.data.rows || []);

            // Aggregate all unique permissions across all policies for the matrix
            const allPolicies = permRes.data.data || [];
            const aggregatedPerms = [];
            const seenPerms = new Set();

            allPolicies.forEach(policy => {
                (policy.permissions || []).forEach(p => {
                    if (!seenPerms.has(p.permission)) {
                        seenPerms.add(p.permission);
                        aggregatedPerms.push(p);
                    }
                });
            });

            setPermissions(aggregatedPerms.length > 0 ? aggregatedPerms : [
                { id: 1, permission: 'manage_tickets', description: 'Can reply to and close support tickets' },
                { id: 2, permission: 'manage_tenants', description: 'Can add and edit businesses' },
                { id: 3, permission: 'view_analytics', description: 'Can see platform-wide growth data' },
                { id: 4, permission: 'manage_staff', description: 'Can manage other portal staff' },
                { id: 5, permission: 'update_settings', description: 'Can change platform global settings' }
            ]);
        } catch (err) {
            toast.error("Failed to load permission systems");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (role) => {
        setEditing(role.id);
        const rolePermIds = permissions
            .filter(p => role.permissions.includes(p.permission))
            .map(p => p.id);
        
        setFormData({
            name: role.name,
            selectedPermissions: rolePermIds,
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                permissions: formData.selectedPermissions,
                branch: null
            };

            if (editing) {
                await axios.put(`/api/getRoleProps?id=${editing}`, payload);
                toast.success("Role updated");
            } else {
                await axios.post('/api/getRoleProps', payload);
                toast.success("Portal role created successfully");
            }
            setShowModal(false);
            setEditing(null);
            fetchData();
        } catch (err) {
            toast.error("Failed to save role");
        }
    };

    const togglePermission = (id) => {
        setFormData(prev => ({
            ...prev,
            selectedPermissions: prev.selectedPermissions.includes(id)
                ? prev.selectedPermissions.filter(p => p !== id)
                : [...prev.selectedPermissions, id]
        }));
    };

    if (loading && !roles.length) {
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
                    <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight">Security Architect</h1>
                    <p className="text-sm text-gray-500 font-medium">Define granular access policies for platform personnel</p>
                </div>
                <button
                    onClick={() => {
                        setEditing(null);
                        setFormData({ name: '', selectedPermissions: [] });
                        setShowModal(true);
                    }}
                    className="bg-[#0F1626] text-white px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
                >
                    <Plus size={18} /> Design New Role
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {roles.map((r) => (
                    <Card key={r.id} className="border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-gray-50">
                        <CardHeader className="bg-white border-b border-gray-50 py-6 px-8 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <CardTitle className="text-lg font-bold">{r.name}</CardTitle>
                            </div>
                            <button 
                                onClick={() => handleEdit(r)}
                                className="text-gray-300 hover:text-indigo-600 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Privileges</p>
                                <div className="flex flex-wrap gap-2">
                                    {(r.permissions || ['No Privileges assigned']).map((p, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100">
                                            {p.replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border border-white/20">
                        <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-[#0F1626] tracking-tighter">Define System Privilege</h3>
                                <p className="text-sm text-gray-400 mt-1 font-medium">Select exactly what this role is authorized to do.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="h-12 w-12 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-10">
                            <div className="space-y-8 max-h-[60vh] overflow-y-auto px-2 scrollbar-hide pb-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Identifier</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-[1.5rem] px-6 py-5 text-base focus:ring-2 focus:ring-indigo-100 font-bold"
                                        placeholder="E.g. Senior Support Agent"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Permissions Matrix</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {permissions.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => togglePermission(p.id)}
                                                className={`flex items-center justify-between p-5 rounded-[1.5rem] border transition-all ${formData.selectedPermissions.includes(p.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                    : 'bg-white border-gray-100 text-gray-600 hover:border-indigo-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-xl ${formData.selectedPermissions.includes(p.id) ? 'bg-white/20' : 'bg-gray-50'}`}>
                                                        <Lock size={18} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-sm uppercase tracking-tight">{p.permission.replace(/_/g, ' ')}</p>
                                                        <p className={`text-xs ${formData.selectedPermissions.includes(p.id) ? 'text-indigo-100' : 'text-gray-400'}`}>{p.description}</p>
                                                    </div>
                                                </div>
                                                {formData.selectedPermissions.includes(p.id) ? <CheckCircle2 size={24} /> : <Circle size={24} className="opacity-20" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-[#0F1626] text-white py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all">
                                Deploy Security Policy
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
