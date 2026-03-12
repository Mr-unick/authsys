import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LifeBuoy, Plus, MessageSquare, Clock, AlertCircle,
    CheckCircle2, ChevronRight, Search, Filter, Loader2, Send, ArrowLeft, ArrowRight,
    User, Building2, Calendar, Hash, Shield, History, StickyNote,
    UserCheck, MoreVertical, X, Sparkles
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
        const isPortalAdmin = role.includes('SUPER') || role === 'ADMIN_PORTAL' || (role === 'ADMIN' && !user.business);

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

export default function SupportPage({ isRestricted, user: currentUser }) {
    const [tickets, setTickets] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [ticketDetail, setTicketDetail] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newInternalNote, setNewInternalNote] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [newTicket, setNewTicket] = useState({ subject: '', description: '', priority: 'medium', category: 'technical' });

    const role = useMemo(() => {
        const r = (currentUser.role || 'USER').toUpperCase().replace(/\s+/g, '_');
        return r === 'SUPER_ADMIN' || (r === 'ADMIN' && !currentUser.business) ? 'SUPER_ADMIN' : 'USER';
    }, [currentUser]);

    const isStaff = role === 'SUPER_ADMIN';

    const loadTickets = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/support/tickets');
            setTickets(res.data.data);

            if (isStaff) {
                const staffRes = await axios.get('/api/admin/staff');
                setStaff(staffRes.data.data);
            }
        } catch (err) {
            toast.error("Failed to load tickets");
        } finally {
            setLoading(false);
        }
    }, [isStaff]);

    useEffect(() => {
        if (!isRestricted) loadTickets();
    }, [loadTickets, isRestricted]);

    const openTicket = async (ticket) => {
        setSelectedTicket(ticket);
        setTicketDetail(null);
        try {
            const res = await axios.get(`/api/support/tickets/${ticket.id}`);
            setTicketDetail(res.data.data);
            setMessages(res.data.data.messages);
        } catch (err) {
            toast.error("Failed to load ticket details");
        }
    };

    const handleSendMessage = async (isInternal = false) => {
        const msg = isInternal ? newInternalNote : newMessage;
        if (!msg.trim()) return;

        try {
            const res = await axios.post(`/api/support/tickets/${selectedTicket.id}`, {
                message: msg,
                isInternal
            });

            if (isInternal) {
                setNewInternalNote('');
                // Refresh detail to show new internal note
                const updatedDetail = await axios.get(`/api/support/tickets/${selectedTicket.id}`);
                setTicketDetail(updatedDetail.data.data);
            } else {
                setMessages([...messages, res.data.data]);
                setNewMessage('');
                // Update status locally if staff responded
                if (isStaff) {
                    setTicketDetail({ ...ticketDetail, status: 'waiting-user' });
                    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: 'waiting-user' } : t));
                }
            }
            toast.success(isInternal ? "Internal note added" : "Message sent");
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const updateTicketAttribute = async (updates) => {
        try {
            const res = await axios.patch(`/api/support/tickets/${selectedTicket.id}`, updates);
            setTicketDetail({ ...ticketDetail, ...updates });
            setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, ...updates } : t));

            // Refresh detail for activities
            const detailRes = await axios.get(`/api/support/tickets/${selectedTicket.id}`);
            setTicketDetail(detailRes.data.data);

            toast.success("Ticket updated");
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => {
            const matchesSearch = t.id.toString().includes(searchQuery) ||
                t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.business?.business_name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tickets, searchQuery, statusFilter, priorityFilter]);

    const stats = useMemo(() => {
        if (!isStaff) return null;
        return {
            open: tickets.filter(t => t.status === 'open').length,
            pending: tickets.filter(t => t.status === 'waiting-user' || t.status === 'in-progress').length,
            urgent: tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length,
            resolvedToday: tickets.filter(t => (t.status === 'resolved' || t.status === 'closed') &&
                new Date(t.updated_at).toDateString() === new Date().toDateString()).length
        };
    }, [tickets, isStaff]);

    const exportToCSV = () => {
        const headers = ["ID", "Subject", "Business", "User", "Status", "Priority", "Category", "Created At"];
        const rows = tickets.map(t => [
            t.id, t.subject, t.business?.business_name, t.user?.name,
            t.status, t.priority, t.category, new Date(t.created_at).toLocaleString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `support_tickets_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatusBadge = ({ status }) => {
        const cfg = {
            'open': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', label: 'UNRESOLVED' },
            'in-progress': { color: 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', label: 'PROCESSING' },
            'resolved': { color: 'bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20', label: 'RESOLVED' },
            'closed': { color: 'bg-slate-50 text-slate-500 border-slate-200/60 dark:bg-white/5 dark:text-gray-400 dark:border-white/10', label: 'CLOSED' },
            'waiting-user': { color: 'bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', label: 'WAITING USER' },
        };
        const c = cfg[status] || cfg.open;
        return (
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all ${c.color}`}>
                <div className={`w-1 h-1 rounded-full ${status === 'open' ? 'bg-emerald-500' : status === 'in-progress' ? 'bg-blue-500' : 'bg-current'}`} />
                {c.label}
            </span>
        );
    };

    if (isRestricted) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4">
                <Card className="rounded-[3rem] p-12 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] border-none flex flex-col items-center text-center gap-6 bg-white dark:bg-white/5 backdrop-blur-xl">
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-8 rounded-[2.5rem] text-indigo-600 dark:text-indigo-400 shadow-inner">
                        <LifeBuoy size={64} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-4xl font-black text-[#0F1626] dark:text-white tracking-tight">Support Restricted</h1>
                        <p className="text-base text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                            The internal ticketing module is currently inactive for your organization. Upgrade your plan to unlock priority support.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-[#0F1626] dark:bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(15,22,38,0.3)] dark:shadow-none mt-4"
                    >
                        Return to Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] flex bg-white dark:bg-black/10 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-2xl shadow-slate-200/20 overflow-hidden mx-1">
            {/* Sidebar Ticket List */}
            <div className={`w-full md:w-80 lg:w-[400px] flex flex-col border-r border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] transition-all duration-300 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-8 border-b border-slate-100 dark:border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-black text-[#0F1626] dark:text-white flex items-center gap-2 tracking-tight">
                            <Shield className="text-indigo-600" size={20} /> Help Desk
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={loadTickets}
                                className={`p-2 text-gray-400 hover:text-indigo-600 transition-colors ${loading ? 'animate-spin text-indigo-600' : ''}`}
                                title="Refresh Tickets"
                            >
                                <History size={18} />
                            </button>
                            {!isStaff && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
                                >
                                    <Plus size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search Case..."
                                className="w-full bg-white dark:bg-black/40 border border-slate-200/60 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-bold focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-white dark:bg-black/40 border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-indigo-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all text-slate-600 dark:text-slate-300"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">Processing</option>
                                <option value="waiting-user">Waiting</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                            <select
                                className="flex-1 bg-white dark:bg-black/40 border border-slate-200/60 dark:border-white/5 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-indigo-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all text-slate-600 dark:text-slate-300"
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                            >
                                <option value="all">Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col py-4">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                            <div className="w-12 h-12 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm">
                                <Loader2 className="animate-spin text-indigo-500" size={24} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Desk...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-12 text-center space-y-4">
                            <div className="bg-white dark:bg-white/5 w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-300 dark:text-slate-600 shadow-sm">
                                <MessageSquare size={28} />
                            </div>
                            <p className="text-xs font-bold text-slate-400">No matching tickets found</p>
                        </div>
                    ) : (
                        <div className="space-y-1 mt-2 mx-4 mb-4">
                            {filteredTickets.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => openTicket(t)}
                                    className={`w-full p-5 text-left transition-all rounded-3xl group relative border ${selectedTicket?.id === t.id
                                        ? 'bg-white dark:bg-[#0A0F1A] border-transparent shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] translate-x-2'
                                        : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-white/[0.05] hover:border-white dark:hover:border-white/5'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <StatusBadge status={t.status} />
                                        <div className="flex items-center gap-2">
                                            {t.priority === 'urgent' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />}
                                            <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">CS-{t.id}</span>
                                        </div>
                                    </div>
                                    <h4 className={`text-sm font-bold pr-4 leading-relaxed mb-4 line-clamp-2 ${selectedTicket?.id === t.id ? 'text-[#0F1626] dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {t.subject}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><User size={12} className={selectedTicket?.id === t.id ? 'text-indigo-500' : ''} /> <span className="truncate max-w-[100px]">{t.user?.name}</span></span>
                                        {isStaff && <span className="flex items-center gap-1.5"><Building2 size={12} /> <span className="truncate max-w-[100px]">{t.business?.business_name}</span></span>}
                                    </div>

                                    {/* Active Indicator */}
                                    {selectedTicket?.id === t.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-indigo-600 rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Pane */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-[#0A0F1A] ${!selectedTicket ? 'hidden md:flex items-center justify-center text-center p-20' : 'flex'}`}>
                {!selectedTicket ? (
                    <div className="max-w-4xl w-full mx-auto space-y-16 animate-in fade-in duration-1000">
                        {isStaff && stats && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform cursor-default">
                                    <div className="bg-white dark:bg-emerald-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-emerald-600">
                                        <AlertCircle size={18} />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none tracking-tight">{stats.open}</h3>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Open Cases</p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform cursor-default">
                                    <div className="bg-white dark:bg-blue-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                                        <Clock size={18} />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none tracking-tight">{stats.pending}</h3>
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Wait Team</p>
                                </div>
                                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-400/20 rounded-full blur-2xl flex items-center justify-center mx-auto mb-4 shadow-sm text-red-600" />
                                    <div className="bg-white dark:bg-red-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-red-600">
                                        <AlertCircle size={18} />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none tracking-tight">{stats.urgent}</h3>
                                    <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Critical</p>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 text-center space-y-2 hover:-translate-y-1 transition-transform cursor-default">
                                    <div className="bg-white dark:bg-indigo-500/20 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-indigo-600">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none tracking-tight">{stats.resolvedToday}</h3>
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-1">Resolved (24h)</p>
                                </div>
                            </div>
                        )}

                        <div className="text-center space-y-10 py-10 flex flex-col items-center">
                            <div className="relative inline-block group">
                                <div className="absolute inset-0 bg-indigo-500/20 dark:bg-indigo-500/40 rounded-[3rem] blur-2xl group-hover:blur-3xl transition-all duration-700 opacity-50" />
                                <div className="relative bg-white dark:bg-[#0A0F1A] border-4 border-indigo-50 dark:border-white/5 w-32 h-32 rounded-[3.5rem] flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 rotate-[5deg] group-hover:rotate-0 transition-all duration-500 shadow-2xl">
                                    <Shield size={48} strokeWidth={1.5} />
                                </div>
                            </div>
                            <div className="space-y-4 max-w-lg">
                                <h2 className="text-4xl md:text-5xl font-black text-[#0F1626] dark:text-white tracking-tight italic">Unified Hub</h2>
                                <p className="text-base text-slate-400 font-medium leading-relaxed">
                                    Select a service request from the side navigation to manage resolution timelines and user collaboration.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-8 pt-8">
                                {isStaff && (
                                    <button
                                        onClick={exportToCSV}
                                        className="flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] bg-[#0F1626] dark:bg-indigo-600 px-8 py-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all"
                                    >
                                        <Hash size={14} /> Export Insight Report
                                    </button>
                                )}
                                <div className="flex flex-col items-center gap-4 pt-4 border-t border-slate-100 dark:border-white/5 w-full max-w-xs">
                                    <div className="flex -space-x-4">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`} className="w-10 h-10 rounded-full border-[3px] border-white dark:border-[#05080F] shadow-lg bg-indigo-50" alt="agent" />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{staff.length > 0 ? staff.length : 5} Technicians Active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !ticketDetail ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Detail Header */}
                        <div className="p-8 border-b border-slate-100 dark:border-white/5 flex flex-col xl:flex-row xl:items-start justify-between gap-6 relative z-20">
                            <div className="flex items-start gap-5">
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden mt-1 p-2 bg-slate-50 dark:bg-white/5 rounded-xl text-slate-400 hover:text-[#0F1626] dark:hover:text-white transition-colors">
                                    <ArrowLeft size={18} />
                                </button>
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <StatusBadge status={ticketDetail.status} />
                                        <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded bg-slate-900 text-white shadow-sm ${ticketDetail.priority === 'urgent' ? 'bg-red-600 shadow-red-500/20' : 'bg-[#0F1626] dark:bg-white/10 dark:text-slate-300'}`}>
                                            {ticketDetail.priority}
                                        </span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-black text-[#0F1626] dark:text-white tracking-tight leading-snug">{ticketDetail.subject}</h2>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-bold text-slate-400">
                                        <span className="flex items-center gap-1.5"><Hash size={12} className="text-indigo-600" /> TICK-{ticketDetail.id}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(ticketDetail.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 pt-2 xl:pt-0">
                                {isStaff && (
                                    <>
                                        <div className="flex items-center gap-2 group relative">
                                            <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group-hover:border-indigo-200 transition-colors">
                                                <UserCheck size={14} className="text-slate-500" />
                                            </div>
                                            <select
                                                className="bg-white dark:bg-[#0A0F1A] border border-slate-200/60 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-indigo-100 cursor-pointer px-4 py-2.5 shadow-sm text-slate-600 dark:text-slate-300"
                                                value={ticketDetail.assigned_to_id || ''}
                                                onChange={(e) => updateTicketAttribute({ assigned_to_id: e.target.value ? parseInt(e.target.value) : null })}
                                            >
                                                <option value="">Unassigned</option>
                                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 group relative">
                                            <div className="p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group-hover:border-indigo-200 transition-colors">
                                                <Shield size={14} className="text-slate-500" />
                                            </div>
                                            <select
                                                className="bg-white dark:bg-[#0A0F1A] border border-slate-200/60 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-4 focus:ring-indigo-100 cursor-pointer px-4 py-2.5 shadow-sm text-slate-600 dark:text-slate-300"
                                                value={ticketDetail.status}
                                                onChange={(e) => updateTicketAttribute({ status: e.target.value })}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in-progress">Processing</option>
                                                <option value="waiting-user">Waiting</option>
                                                <option value="resolved">Resolved</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <Tabs defaultValue="messages" className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-8 bg-slate-50/50 dark:bg-white/[0.02] border-b border-slate-100 dark:border-white/5 flex-shrink-0">
                                <TabsList className="bg-transparent gap-8 p-0 h-auto w-full md:w-auto overflow-x-auto scrollbar-hide flex-nowrap shrink-0">
                                    <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-indigo-600 rounded-none px-0 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-[#0F1626] dark:data-[state=active]:text-white transition-all border-b-[3px] border-transparent">
                                        <MessageSquare size={14} className="mr-2" /> Message Log
                                    </TabsTrigger>
                                    {isStaff && (
                                        <TabsTrigger value="internal" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-amber-500 rounded-none px-0 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-amber-600 dark:data-[state=active]:text-amber-400 transition-all border-b-[3px] border-transparent">
                                            <StickyNote size={14} className="mr-2" /> Internal Notes
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-slate-800 dark:data-[state=active]:border-white rounded-none px-0 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 data-[state=active]:text-[#0F1626] dark:data-[state=active]:text-white transition-all border-b-[3px] border-transparent">
                                        <History size={14} className="mr-2" /> Activity Audit
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col">
                                <TabsContent value="messages" className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden m-0">
                                    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                        {/* Initial Request Description */}
                                        {ticketDetail.description && (
                                            <div className="max-w-2xl mx-auto w-full bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-5">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                        <User size={13} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{ticketDetail.user?.name}</p>
                                                        <p className="text-[10px] text-slate-400">{new Date(ticketDetail.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                    </div>
                                                    <span className="ml-auto text-[9px] font-black text-indigo-500 uppercase tracking-[0.15em] flex items-center gap-1">
                                                        <Sparkles size={10} /> Initial Request
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-9">
                                                    {ticketDetail.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Interaction Thread */}
                                        <div className="space-y-3 max-w-3xl mx-auto w-full">
                                            {messages.map((m, idx) => {
                                                // is_admin = sent by support staff → LEFT side
                                                // !is_admin = sent by the user who raised the ticket → RIGHT side
                                                const isSupportMsg = m.is_admin;
                                                return (
                                                    <div key={m.id} className={`flex flex-col ${isSupportMsg ? 'items-start' : 'items-end'}`}>
                                                        {/* Sender label */}
                                                        <div className={`flex items-center gap-1.5 mb-1 px-1 ${isSupportMsg ? 'flex-row' : 'flex-row-reverse'}`}>
                                                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${isSupportMsg
                                                                ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                                                : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                                                                }`}>
                                                                {isSupportMsg ? <Shield size={11} /> : (m.sender?.name?.[0] || 'U')}
                                                            </div>
                                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                                {isSupportMsg ? (m.sender?.name || 'Support Team') : (m.sender?.name || ticketDetail.user?.name || 'You')}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400">
                                                                {new Date(m.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                            </span>
                                                        </div>
                                                        {/* Bubble */}
                                                        <div className={`px-4 py-3 rounded-2xl max-w-[78%] ${isSupportMsg
                                                            ? 'bg-white dark:bg-white/8 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-white/10 rounded-tl-none shadow-sm'
                                                            : 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-300/30 shadow-sm'
                                                            }`}>
                                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Footer Input */}
                                    {ticketDetail.status !== 'closed' && (
                                        <div className="flex-shrink-0 p-4 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#0A0F1A]">
                                            <div className="flex items-end gap-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-500/20 focus-within:border-indigo-300 dark:focus-within:border-indigo-500/40 transition-all">
                                                <textarea
                                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 min-h-[44px] max-h-[160px] resize-none leading-relaxed placeholder:text-slate-400"
                                                    placeholder="Draft your response..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(false); } }}
                                                />
                                                <button
                                                    onClick={() => handleSendMessage(false)}
                                                    disabled={!newMessage.trim()}
                                                    className="flex-shrink-0 p-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                                                >
                                                    <Send size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 px-1">Press Enter to send · Shift+Enter for new line</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="internal" className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden m-0">
                                    <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                                        {ticketDetail.internalNotes?.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                                <StickyNote size={48} className="mb-6 stroke-1 text-slate-400" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">No Internal Stack Records</p>
                                            </div>
                                        ) : (
                                            <div className="max-w-3xl mx-auto space-y-4">
                                                {ticketDetail.internalNotes?.map(note => (
                                                    <div key={note.id} className="bg-amber-50/50 dark:bg-amber-500/10 border border-amber-100/50 dark:border-amber-500/20 p-6 rounded-3xl">
                                                        <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium">"{note.note}"</p>
                                                        <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-amber-600/70 dark:text-amber-400/70 flex items-center justify-between">
                                                            <span className="flex items-center gap-2"><User size={12} /> Tech Ops</span>
                                                            <span>{new Date(note.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 p-4 border-t border-amber-100 dark:border-amber-500/10 bg-amber-50/30 dark:bg-amber-500/5">
                                        <div className="flex items-end gap-3 bg-white dark:bg-[#0A0F1A] border border-amber-200 dark:border-amber-500/20 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                                            <textarea
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 min-h-[44px] max-h-[120px] resize-none leading-relaxed placeholder:text-slate-400"
                                                placeholder="Add internal note (staff only)..."
                                                value={newInternalNote}
                                                onChange={(e) => setNewInternalNote(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleSendMessage(true)}
                                                disabled={!newInternalNote.trim()}
                                                className="flex-shrink-0 p-3 bg-amber-500 text-white rounded-xl shadow-md hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity" className="flex-1 min-h-0 overflow-y-auto p-8 m-0 scrollbar-hide data-[state=inactive]:hidden">
                                    <div className="max-w-2xl mx-auto space-y-8 relative">
                                        <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-white/5 rounded-full" />
                                        {ticketDetail.activities?.map((activity, idx) => (
                                            <div key={activity.id} className="relative pl-14">
                                                <div className={`absolute left-5 -translate-x-1/2 w-4 h-4 rounded-full border-[3px] border-white dark:border-[#05080F] shadow-sm z-10 ${activity.type === 'status_change' ? 'bg-indigo-600' :
                                                    activity.type === 'assignment' ? 'bg-amber-500' : 'bg-slate-400'
                                                    }`} />
                                                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 space-y-2">
                                                    <p className="text-sm font-bold text-[#0F1626] dark:text-slate-200 leading-snug">{activity.description}</p>
                                                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-400">
                                                        {activity.actor_name}
                                                        {activity.is_admin && <Shield size={10} className="text-indigo-500" />}
                                                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
                                                        {new Date(activity.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="relative pl-14">
                                            <div className="absolute left-5 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-white dark:border-[#05080F] shadow-sm z-10" />
                                            <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5 opacity-70">
                                                <p className="text-xs font-medium text-slate-500">
                                                    Ticket initialized by <span className="font-bold text-slate-700 dark:text-slate-300">{ticketDetail.user?.name}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </>
                )}
            </div>

            {/* Create Ticket Modal */}
            {
                showCreateModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-[#0A0F1A] rounded-[3rem] w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-300 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col">
                            <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#05080F] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black italic tracking-tight text-[#0F1626] dark:text-white flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Shield size={18} strokeWidth={2.5} />
                                        </div>
                                        Support Request
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2 pl-14">Initialize a new resolution cycle</p>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="relative z-10 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors p-3 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block">Case Subject</label>
                                    <input
                                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200/60 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-[#0F1626] dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-inner transition-all"
                                        placeholder="Brief summary of the challenge"
                                        value={newTicket.subject}
                                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block">Urgency</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200/60 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-inner transition-all appearance-none cursor-pointer"
                                            value={newTicket.priority}
                                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Critical</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block">Category</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200/60 dark:border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-inner transition-all appearance-none cursor-pointer"
                                            value={newTicket.category}
                                            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        >
                                            <option value="technical">Technical</option>
                                            <option value="billing">Billing</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="account">Account Access</option>
                                            <option value="other">General</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block">Detailed Description</label>
                                    <textarea
                                        rows={5}
                                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200/60 dark:border-white/10 rounded-[2rem] px-6 py-5 text-sm font-medium text-[#0F1626] dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-500/20 shadow-inner resize-none transition-all"
                                        placeholder="Explain the technical details..."
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={async () => {
                                            if (!newTicket.subject || !newTicket.description) return;
                                            try {
                                                await axios.post('/api/support/tickets', newTicket);
                                                toast.success("Request submitted successfully");
                                                setShowCreateModal(false);
                                                loadTickets();
                                            } catch (err) { toast.error("Submission failed"); }
                                        }}
                                        className="w-full flex items-center justify-center gap-3 bg-[#0F1626] dark:bg-indigo-600 text-white py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(15,22,38,0.5)] dark:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.5)] hover:scale-[1.02] active:scale-95 transition-all group"
                                    >
                                        Dispatch Request <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
