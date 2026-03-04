import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LifeBuoy, Plus, MessageSquare, Clock, AlertCircle,
    CheckCircle2, ChevronRight, Search, Filter, Loader2, Send, ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs';

import { VerifyToken as verifyTokenInternal } from '../utils/VerifyToken';

export async function getServerSideProps(context) {
    const { req, res } = context;
    const mockRes = { status: () => ({ json: () => { } }), writableEnded: false };
    const user = await verifyTokenInternal(req, mockRes, null);

    if (!user || mockRes.writableEnded) {
        return { redirect: { destination: '/signin', permanent: false } };
    }

    let isRestricted = false;
    if (user.business) {
        const role = (user.role || '').toUpperCase();
        const isPortalAdmin = role.includes('SUPER') || role === 'ADMIN_PORTAL';

        if (!isPortalAdmin) {
            const prisma = (await import('@/app/lib/prisma')).default;
            const feature = await prisma.businessFeature.findUnique({
                where: {
                    business_id_feature_key: {
                        business_id: Number(user.business),
                        feature_key: 'support_system'
                    }
                }
            });
            if (!feature || !feature.is_enabled) {
                isRestricted = true;
            }
        }
    }

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)),
            isRestricted
        }
    };
}

export default function SupportPage({ isRestricted }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [role, setRole] = useState(null);
    const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'medium' });

    if (isRestricted) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4">
                <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-gray-100 border border-gray-50 flex flex-col items-center text-center gap-6">
                    <div className="bg-indigo-50 p-6 rounded-[2rem] text-indigo-600">
                        <LifeBuoy size={60} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-[#0F1626] tracking-tight">Support Desk Restricted</h1>
                        <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                            Internal support ticketing is not enabled for your current business plan.
                            Please contact your portal administrator to upgrade your access.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-[#0F1626] text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const loadTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/support/tickets');
            setTickets(res.data.data);
            const auth = await axios.get('/api/auth/isauthenticated');
            setRole(auth.data.data.role);
        } catch (err) {
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadTickets();
    }, [loadTickets]);

    const openTicket = async (ticket) => {
        setSelectedTicket(ticket);
        try {
            const res = await axios.get(`/api/support/tickets/${ticket.id}`);
            setMessages(res.data.data.messages);
        } catch (err) {
            toast.error("Failed to load messages");
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const res = await axios.post(`/api/support/tickets/${selectedTicket.id}`, { message: newMessage });
            setMessages([...messages, res.data.data]);
            setNewMessage('');
        } catch (err) {
            toast.error("Failed to send message");
        }
    };

    const handleCreateTicket = async () => {
        if (!newTicket.subject || !newTicket.description) return;
        try {
            await axios.post('/api/support/tickets', newTicket);
            toast.success("Ticket raised successfully");
            setShowCreateModal(false);
            setNewTicket({ subject: '', description: '', priority: 'medium' });
            loadTickets();
        } catch (err) {
            toast.error("Failed to raise ticket");
        }
    };

    const StatusBadge = ({ status }) => {
        const cfg = {
            open: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Open' },
            'in-progress': { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'In Progress' },
            resolved: { color: 'bg-green-100 text-green-700 border-green-200', label: 'Resolved' },
            closed: { color: 'bg-gray-100 text-gray-500 border-gray-200', label: 'Closed' },
        };
        const c = cfg[status] || cfg.open;
        return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.color}`}>{c.label}</span>;
    };

    if (loading && !tickets.length) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
            </div>
        );
    }

    if (selectedTicket) {
        return (
            <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <button
                    onClick={() => setSelectedTicket(null)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6 font-bold"
                >
                    <ArrowLeft size={16} /> Back to Tickets
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card className="border-none shadow-sm rounded-2xl">
                            <CardHeader className="border-b border-gray-50">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <StatusBadge status={selectedTicket.status} />
                                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">#{selectedTicket.id}</span>
                                        </div>
                                        <CardTitle className="text-xl font-bold">{selectedTicket.subject}</CardTitle>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Priority</p>
                                        <span className={`text-xs font-bold ${selectedTicket.priority === 'urgent' ? 'text-red-600' : 'text-gray-600'}`}>
                                            {selectedTicket.priority.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    {selectedTicket.description}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Messages Area */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Conversation</h3>
                            <div className="space-y-4 max-h-[500px] overflow-y-auto px-2 scrollbar-hide">
                                {messages.map((m) => (
                                    <div key={m.id} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${m.is_admin
                                            ? 'bg-white border border-gray-100 rounded-tl-none'
                                            : 'bg-indigo-600 text-white rounded-tr-none'
                                            }`}>
                                            <p className="text-sm">{m.message}</p>
                                            <p className={`text-[9px] mt-2 font-bold uppercase tracking-tighter opacity-70`}>
                                                {new Date(m.created_at).toLocaleString()} {m.is_admin && '• Support Team'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-end gap-2">
                                <textarea
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 min-h-[60px] resize-none"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all mb-1 mr-1"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-64 space-y-4">
                        <Card className="border-none shadow-sm rounded-2xl bg-[#0F1626] text-white">
                            <CardContent className="p-6 space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Business</p>
                                    <p className="text-sm font-bold truncate">{selectedTicket.business?.business_name || 'Portal User'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Created By</p>
                                    <p className="text-sm font-bold truncate">{selectedTicket.user?.name}</p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">Manage Status</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {role === 'SUPER_ADMIN' ? (
                                            ['open', 'in-progress', 'resolved', 'closed'].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={async () => {
                                                        await axios.patch(`/api/support/tickets/${selectedTicket.id}`, { status: s });
                                                        setSelectedTicket({ ...selectedTicket, status: s });
                                                        toast.success(`Status updated to ${s}`);
                                                    }}
                                                    className={`text-[10px] font-bold py-1.5 rounded-lg border border-white/10 transition-all ${selectedTicket.status === s ? 'bg-indigo-600 border-indigo-500' : 'hover:bg-white/5'
                                                        }`}
                                                >
                                                    {s.toUpperCase()}
                                                </button>
                                            ))
                                        ) : (
                                            selectedTicket.status !== 'closed' && (
                                                <button
                                                    onClick={async () => {
                                                        await axios.patch(`/api/support/tickets/${selectedTicket.id}`, { status: 'closed' });
                                                        setSelectedTicket({ ...selectedTicket, status: 'closed' });
                                                        toast.success(`Ticket closed`);
                                                    }}
                                                    className="text-[10px] font-bold py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                                                >
                                                    CLOSE TICKET
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-8 pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight">Support Center</h1>
                    <p className="text-sm text-gray-500 font-medium">Get assistance with your LeadConverter workspace</p>
                </div>
                {role !== 'SUPER_ADMIN' && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                    >
                        <Plus size={18} /> Raise a Ticket
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: 'Total Tickets', value: tickets.length, icon: <LifeBuoy size={18} />, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Pending', value: tickets.filter(t => t.status === 'open').length, icon: <Clock size={18} />, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Resolved', value: tickets.filter(t => t.status === 'resolved').length, icon: <CheckCircle2 size={18} />, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'High Priority', value: tickets.filter(t => t.priority === 'urgent' || t.priority === 'high').length, icon: <AlertCircle size={18} />, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-2xl overflow-hidden">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>{stat.icon}</div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-[#0F1626]">{stat.value}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* List */}
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between p-6">
                    <CardTitle className="text-base font-bold text-[#0F1626]">Service Requests</CardTitle>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="bg-gray-50 border-none rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-indigo-100 w-48 md:w-64"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50">
                        {tickets.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="bg-gray-50 h-16 w-16 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <LifeBuoy className="text-gray-300" size={32} />
                                </div>
                                <h3 className="text-sm font-bold text-[#0F1626]">No tickets found</h3>
                                <p className="text-xs text-gray-400 mt-1">Raise a ticket to get support from our team.</p>
                            </div>
                        ) : (
                            tickets.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => openTicket(t)}
                                    className="w-full text-left p-5 hover:bg-gray-50 transition-all flex items-center gap-4 group"
                                >
                                    <div className={`p-3 rounded-2xl ${t.status === 'resolved' ? 'bg-green-50 text-green-600' :
                                        t.status === 'open' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <StatusBadge status={t.status} />
                                            <span className="text-[10px] font-bold text-gray-400">#{t.id}</span>
                                            {t.priority === 'urgent' && <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">URGENT</span>}
                                        </div>
                                        <h4 className="font-bold text-[#0F1626] text-sm truncate pr-4">{t.subject}</h4>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <p className="text-[11px] text-gray-400 font-medium">By {t.user?.name || 'Unknown'}</p>
                                            <span className="w-1 h-1 rounded-full bg-gray-200" />
                                            <p className="text-[11px] text-gray-400 font-medium">{new Date(t.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                </button>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-[#0F1626] text-white">
                            <div>
                                <h3 className="text-lg font-bold">Raise Support Ticket</h3>
                                <p className="text-xs text-indigo-300">Tell us what's wrong and we'll help you fix it.</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-white/50 hover:text-white transition-colors">
                                <Plus className="rotate-45" size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subject</label>
                                <input
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100 font-bold"
                                    placeholder="Brief summary of the issue"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Priority</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['low', 'medium', 'urgent'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setNewTicket({ ...newTicket, priority: p })}
                                            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${newTicket.priority === p
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Detailed Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-100"
                                    placeholder="Explain the issue in detail..."
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleCreateTicket}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:scale-[0.98] transition-all"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
