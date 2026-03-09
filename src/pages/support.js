import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LifeBuoy, Plus, MessageSquare, Clock, AlertCircle,
    CheckCircle2, ChevronRight, Search, Filter, Loader2, Send, ArrowLeft,
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
            'open': { color: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20', label: 'UNRESOLVED' },
            'in-progress': { color: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20', label: 'PROCESSING' },
            'resolved': { color: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20', label: 'RESOLVED' },
            'closed': { color: 'bg-gray-50 text-gray-500 border-gray-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10', label: 'CLOSED' },
            'waiting-user': { color: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20', label: 'WAITING USER' },
        };
        const c = cfg[status] || cfg.open;
        return <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border tracking-tighter ${c.color}`}>{c.label}</span>;
    };

    if (isRestricted) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4">
                <Card className="rounded-[3rem] p-12 shadow-xl border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-6 bg-white dark:bg-white/5">
                    <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-[2rem] text-indigo-600 dark:text-indigo-400">
                        <LifeBuoy size={60} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black text-[#0F1626] dark:text-white tracking-tight">Support Desk Restricted</h1>
                        <p className="text-sm text-gray-400 font-medium max-w-sm mx-auto leading-relaxed">
                            Internal support ticketing is not enabled for your current business plan.
                            Please contact your portal administrator to upgrade your access.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-[#0F1626] dark:bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-gray-200 dark:shadow-none"
                    >
                        Back to Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-100px)] min-h-[600px] flex overflow-hidden -mx-4 -my-4">
            {/* Sidebar Ticket List */}
            <div className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-black/20 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6 border-b border-gray-100 dark:border-white/5 space-y-4">
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
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search Case..."
                                className="w-full bg-white dark:bg-white/5 border-none rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-100 dark:focus:ring-white/10 shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-white dark:bg-white/5 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-100 shadow-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="open">Open</option>
                                <option value="in-progress">In Progress</option>
                                <option value="waiting-user">Waiting</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                            <select
                                className="flex-1 bg-white dark:bg-white/5 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-100 shadow-sm"
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

                <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col divide-y divide-gray-100 dark:divide-white/5">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center gap-4 text-gray-400">
                            <Loader2 className="animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Loading Tickets...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="bg-gray-100 dark:bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                                <Search size={24} />
                            </div>
                            <p className="text-xs font-bold text-gray-400">No tickets found</p>
                        </div>
                    ) : (
                        filteredTickets.map(t => (
                            <button
                                key={t.id}
                                onClick={() => openTicket(t)}
                                className={`w-full p-6 text-left transition-all hover:bg-gray-50 dark:hover:bg-white/5 group relative ${selectedTicket?.id === t.id ? 'bg-white dark:bg-white/5 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <StatusBadge status={t.status} />
                                    <span className="text-[10px] font-black text-gray-400 tracking-widest">#{t.id}</span>
                                </div>
                                <h4 className={`text-sm font-bold truncate pr-4 ${selectedTicket?.id === t.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-[#0F1626] dark:text-gray-300'}`}>
                                    {t.subject}
                                </h4>
                                <div className="mt-3 flex items-center gap-3 text-[10px] font-bold text-gray-400">
                                    <span className="flex items-center gap-1"><User size={10} /> {t.user?.name}</span>
                                    {isStaff && <span className="flex items-center gap-1"><Building2 size={10} /> {t.business?.business_name}</span>}
                                </div>
                                {t.priority === 'urgent' && (
                                    <div className="absolute top-0 right-0 p-1">
                                        <div className="bg-red-500 w-1.5 h-1.5 rounded-full animate-pulse shadow-sm shadow-red-500/50" />
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Ticket Detail Pane */}
            <div className={`flex-1 flex flex-col bg-white dark:bg-[#0A0F1A] ${!selectedTicket ? 'hidden md:flex items-center justify-center text-center p-20' : 'flex'}`}>
                {!selectedTicket ? (
                    <div className="max-w-4xl w-full mx-auto p-12 space-y-12 overflow-y-auto scrollbar-hide">
                        {isStaff && stats && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-500/20 text-center space-y-2">
                                    <p className="text-[10px] font-black text-emerald-600 block uppercase tracking-widest mb-1">Open Cases</p>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none">{stats.open}</h3>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 text-center space-y-2">
                                    <p className="text-[10px] font-black text-blue-600 block uppercase tracking-widest mb-1">Wait Team</p>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none">{stats.pending}</h3>
                                </div>
                                <div className="bg-red-50 dark:bg-red-500/10 p-6 rounded-[2rem] border border-red-100 dark:border-red-500/20 text-center space-y-2">
                                    <p className="text-[10px] font-black text-red-600 block uppercase tracking-widest mb-1">Critical</p>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none">{stats.urgent}</h3>
                                </div>
                                <div className="bg-indigo-50 dark:bg-indigo-500/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-500/20 text-center space-y-2">
                                    <p className="text-[10px] font-black text-indigo-600 block uppercase tracking-widest mb-1">Resolved (24h)</p>
                                    <h3 className="text-3xl font-black text-[#0F1626] dark:text-white leading-none">{stats.resolvedToday}</h3>
                                </div>
                            </div>
                        )}

                        <div className="text-center space-y-8 py-10">
                            <div className="bg-indigo-50 dark:bg-indigo-500/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 rotate-3 transform hover:rotate-0 transition-all duration-500 shadow-xl shadow-indigo-100 dark:shadow-none">
                                <Shield size={42} />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black text-[#0F1626] dark:text-white tracking-tight italic">Unified Desk</h2>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm mx-auto">
                                    Select a service request from the side navigation to manage resolution timelines and user collaboration.
                                </p>
                            </div>
                            <div className="flex items-center gap-6 justify-center">
                                {isStaff && (
                                    <button
                                        onClick={exportToCSV}
                                        className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] bg-white dark:bg-white/5 px-6 py-2.5 rounded-full border border-indigo-100 dark:border-white/10 hover:bg-indigo-50 transition-all"
                                    >
                                        <Hash size={12} /> Export Insight
                                    </button>
                                )}
                                <div className="flex items-center gap-3 mt-1">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`} className="w-9 h-9 rounded-full border-2 border-white dark:border-black shadow-lg" alt="agent" />
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{staff.length > 0 ? staff.length : 3} Engineers Online</p>
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
                        <div className="p-6 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden p-2 text-gray-400"><ArrowLeft size={18} /></button>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <StatusBadge status={ticketDetail.status} />
                                        <h2 className="text-lg font-black text-[#0F1626] dark:text-white tracking-tight">{ticketDetail.subject}</h2>
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                                        <Hash size={10} /> CASE-{ticketDetail.id}
                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                        <Calendar size={10} /> {new Date(ticketDetail.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {isStaff && (
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                            <AlertCircle size={14} className="text-gray-400" />
                                            <select
                                                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer p-0"
                                                value={ticketDetail.priority}
                                                onChange={(e) => updateTicketAttribute({ priority: e.target.value })}
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                            <UserCheck size={14} className="text-gray-400" />
                                            <select
                                                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer p-0"
                                                value={ticketDetail.assigned_to_id || ''}
                                                onChange={(e) => updateTicketAttribute({ assigned_to_id: e.target.value ? parseInt(e.target.value) : null })}
                                            >
                                                <option value="">Unassigned</option>
                                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                    <Shield size={14} className="text-gray-400" />
                                    <select
                                        className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest focus:ring-0 cursor-pointer p-0"
                                        value={ticketDetail.status}
                                        onChange={(e) => updateTicketAttribute({ status: e.target.value })}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="waiting-user">Waiting User</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <Tabs defaultValue="messages" className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-6 py-2 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                                <TabsList className="bg-transparent gap-6 p-0 h-auto">
                                    <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-indigo-600">
                                        <MessageSquare size={14} className="mr-2" /> Message Log
                                    </TabsTrigger>
                                    {isStaff && (
                                        <TabsTrigger value="internal" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none px-0 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-amber-500">
                                            <StickyNote size={14} className="mr-2" /> Internal Notes
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-gray-600 rounded-none px-0 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white">
                                        <History size={14} className="mr-2" /> Activity Audit
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                <TabsContent value="messages" className="flex-1 flex flex-col overflow-hidden m-0">
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                                        {/* Original Description */}
                                        <div className="flex justify-center">
                                            <div className="max-w-2xl w-full bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                    <Sparkles size={12} className="text-indigo-600" /> Initial Issue Statement
                                                </p>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                                    "{ticketDetail.description}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* Interaction Thread */}
                                        <div className="space-y-6">
                                            {messages.map(m => (
                                                <div key={m.id} className={`flex ${m.is_admin ? 'justify-start' : 'justify-end'}`}>
                                                    <div className={`group relative max-w-[85%] md:max-w-[70%]`}>
                                                        <div className={`p-4 rounded-3xl shadow-sm border ${m.is_admin
                                                            ? 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 rounded-tl-none'
                                                            : 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                                                            }`}>
                                                            <p className="text-sm leading-relaxed">{m.message}</p>
                                                            <div className={`mt-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${m.is_admin ? 'text-gray-400' : 'text-indigo-200'}`}>
                                                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                {m.is_admin && <span className="flex items-center gap-1"><Shield size={8} /> SUPPORT TEAM</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer Input */}
                                    {ticketDetail.status !== 'closed' && (
                                        <div className="p-6 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5">
                                            <div className="relative bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/10 p-2 flex items-end gap-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-100 dark:focus-within:ring-white/10 transition-all">
                                                <textarea
                                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 min-h-[60px] max-h-[200px] resize-none overflow-y-auto"
                                                    placeholder="Enter response..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleSendMessage(false)}
                                                    className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all mb-1 mr-1"
                                                >
                                                    <Send size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="internal" className="flex-1 flex flex-col overflow-hidden m-0">
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                        {ticketDetail.internalNotes?.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                                <StickyNote size={42} className="mb-4" />
                                                <p className="text-xs font-bold uppercase tracking-widest">No secret notes yet</p>
                                            </div>
                                        ) : (
                                            ticketDetail.internalNotes?.map(note => (
                                                <div key={note.id} className="bg-amber-50/30 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl">
                                                    <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">"{note.note}"</p>
                                                    <div className="mt-2 text-[9px] font-black uppercase text-amber-600/60 dark:text-amber-400/50 flex items-center gap-2">
                                                        <User size={10} /> Support Admin • {new Date(note.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-6 bg-amber-50/20 dark:bg-amber-500/5 border-t border-amber-100 dark:border-amber-500/10">
                                        <div className="relative bg-white dark:bg-black/20 rounded-2xl border border-amber-200 dark:border-amber-500/20 p-2 flex items-end gap-2">
                                            <textarea
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-3 min-h-[60px] resize-none"
                                                placeholder="Add internal note (only visible to staff)..."
                                                value={newInternalNote}
                                                onChange={(e) => setNewInternalNote(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleSendMessage(true)}
                                                className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all mb-1 mr-1 shadow-lg shadow-amber-500/20"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity" className="flex-1 overflow-y-auto p-8 m-0 scrollbar-hide">
                                    <div className="max-w-2xl mx-auto space-y-8 relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-white/10" />
                                        {ticketDetail.activities?.map((activity, idx) => (
                                            <div key={activity.id} className="relative pl-10">
                                                <div className={`absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white dark:border-black shadow-sm ${activity.type === 'status_change' ? 'bg-indigo-600' :
                                                    activity.type === 'assignment' ? 'bg-amber-500' : 'bg-gray-400'
                                                    }`} />
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold text-[#0F1626] dark:text-gray-200 leading-none">{activity.description}</p>
                                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-gray-400">
                                                        {activity.actor_name}
                                                        {activity.is_admin && <Shield size={8} className="text-indigo-500" />}
                                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                                        {new Date(activity.created_at).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="relative pl-10 opacity-50">
                                            <div className="absolute left-2.5 -translate-x-1/2 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-black shadow-sm" />
                                            <p className="text-xs font-bold text-gray-400">Ticket was initialized by {ticketDetail.user?.name}</p>
                                        </div>
                                    </div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </>
                )}
            </div>

            {/* Create Ticket Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#0F1626] rounded-[2.5rem] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl border border-white/5">
                        <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-indigo-600 text-white">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tight">Open Support Request</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100 mt-1">Our technicians are standing by</p>
                            </div>
                            <button onClick={() => setShowCreateModal(false)} className="text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Case Subject</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-white/10 font-bold"
                                    placeholder="Brief summary of the challenge"
                                    value={newTicket.subject}
                                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Urgency</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-100 dark:focus:ring-white/10"
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Category</label>
                                    <select
                                        className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-indigo-100 dark:focus:ring-white/10"
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                    >
                                        <option value="technical">Technical</option>
                                        <option value="billing">Billing</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="account">Account Access</option>
                                        <option value="other">General Inquiry</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Detailed Description</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-100 dark:focus:ring-white/10"
                                    placeholder="Explain the technical details..."
                                    value={newTicket.description}
                                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                />
                            </div>
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
                                className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:scale-[0.98] transition-all"
                            >
                                Dispatch Technician
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
