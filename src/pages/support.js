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
                const updatedDetail = await axios.get(`/api/support/tickets/${selectedTicket.id}`);
                setTicketDetail(updatedDetail.data.data);
            } else {
                setMessages([...messages, res.data.data]);
                setNewMessage('');
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
            'open': { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Open' },
            'in-progress': { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'In Progress' },
            'resolved': { color: 'bg-indigo-50 text-indigo-700 border-indigo-200', label: 'Resolved' },
            'closed': { color: 'bg-slate-50 text-slate-500 border-slate-200', label: 'Closed' },
            'waiting-user': { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Waiting' },
        };
        const c = cfg[status] || cfg.open;
        return (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${c.color}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'open' ? 'bg-emerald-500' : status === 'in-progress' ? 'bg-blue-500' : status === 'waiting-user' ? 'bg-amber-500' : 'bg-current'}`} />
                {c.label}
            </span>
        );
    };

    if (isRestricted) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-4">
                <Card className="rounded-xl p-10 border border-slate-100 flex flex-col items-center text-center gap-5 bg-white">
                    <div className="bg-indigo-50 p-6 rounded-xl text-indigo-600 border border-indigo-100">
                        <LifeBuoy size={48} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-slate-800">Support Restricted</h1>
                        <p className="text-sm text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                            The internal ticketing module is currently inactive for your organization. Upgrade your plan to unlock priority support.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors mt-2"
                    >
                        Return to Dashboard
                    </button>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-120px)] flex bg-white rounded-xl border border-slate-100 overflow-hidden mx-1">
            {/* Sidebar Ticket List */}
            <div className={`w-full md:w-80 lg:w-[380px] flex flex-col border-r border-slate-100 bg-slate-50/50 transition-all duration-200 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-5 border-b border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Shield className="text-indigo-600" size={18} /> Help Desk
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={loadTickets}
                                className={`p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors ${loading ? 'animate-spin text-indigo-600' : ''}`}
                                title="Refresh Tickets"
                            >
                                <History size={16} />
                            </button>
                            {!isStaff && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-slate-600"
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
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-slate-600"
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

                <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col py-3">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400">
                            <Loader2 className="animate-spin text-indigo-500" size={20} />
                            <p className="text-xs font-medium text-slate-400">Loading tickets...</p>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="p-10 text-center space-y-3">
                            <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto text-slate-300 border border-slate-100">
                                <MessageSquare size={22} />
                            </div>
                            <p className="text-xs font-medium text-slate-400">No matching tickets found</p>
                        </div>
                    ) : (
                        <div className="space-y-1 mx-3">
                            {filteredTickets.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => openTicket(t)}
                                    className={`w-full p-4 text-left transition-colors rounded-lg group relative ${selectedTicket?.id === t.id
                                        ? 'bg-white border border-slate-200'
                                        : 'border border-transparent hover:bg-white hover:border-slate-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <StatusBadge status={t.status} />
                                        <div className="flex items-center gap-2">
                                            {t.priority === 'urgent' && <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                            <span className="text-xs font-medium text-slate-400">CS-{t.id}</span>
                                        </div>
                                    </div>
                                    <h4 className={`text-sm font-semibold pr-4 leading-relaxed mb-3 line-clamp-2 ${selectedTicket?.id === t.id ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {t.subject}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-slate-400">
                                        <span className="flex items-center gap-1"><User size={11} /> <span className="truncate max-w-[100px]">{t.user?.name}</span></span>
                                        {isStaff && <span className="flex items-center gap-1"><Building2 size={11} /> <span className="truncate max-w-[100px]">{t.business?.business_name}</span></span>}
                                    </div>

                                    {selectedTicket?.id === t.id && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Ticket Detail Pane */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedTicket ? 'hidden md:flex items-center justify-center text-center p-16' : 'flex'}`}>
                {!selectedTicket ? (
                    <div className="max-w-4xl w-full mx-auto space-y-12 animate-in fade-in duration-500">
                        {isStaff && stats && (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 text-center space-y-1">
                                    <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 text-emerald-600 border border-emerald-100">
                                        <AlertCircle size={16} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{stats.open}</h3>
                                    <p className="text-xs font-semibold text-emerald-600">Open Cases</p>
                                </div>
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-center space-y-1">
                                    <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600 border border-blue-100">
                                        <Clock size={16} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{stats.pending}</h3>
                                    <p className="text-xs font-semibold text-blue-600">Pending</p>
                                </div>
                                <div className="bg-red-50 p-5 rounded-xl border border-red-100 text-center space-y-1 relative overflow-hidden">
                                    <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 text-red-600 border border-red-100">
                                        <AlertCircle size={16} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{stats.urgent}</h3>
                                    <p className="text-xs font-semibold text-red-600">Critical</p>
                                </div>
                                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100 text-center space-y-1">
                                    <div className="bg-white w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3 text-indigo-600 border border-indigo-100">
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{stats.resolvedToday}</h3>
                                    <p className="text-xs font-semibold text-indigo-600">Resolved (24h)</p>
                                </div>
                            </div>
                        )}

                        <div className="text-center space-y-6 py-8 flex flex-col items-center">
                            <div className="bg-indigo-50 w-20 h-20 rounded-xl flex items-center justify-center mx-auto text-indigo-600 border border-indigo-100">
                                <Shield size={36} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2 max-w-md">
                                <h2 className="text-2xl font-bold text-slate-800">Help Desk</h2>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                                    Select a ticket from the sidebar to manage resolution timelines and collaborate with the team.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-6 pt-4">
                                {isStaff && (
                                    <button
                                        onClick={exportToCSV}
                                        className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Hash size={14} /> Export Report
                                    </button>
                                )}
                                <div className="flex flex-col items-center gap-3 pt-3 border-t border-slate-100 w-full max-w-xs">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=agent${i}`} className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50" alt="agent" />
                                        ))}
                                    </div>
                                    <p className="text-xs font-medium text-slate-400">{staff.length > 0 ? staff.length : 5} agents active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : !ticketDetail ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-600" size={24} />
                    </div>
                ) : (
                    <>
                        {/* Detail Header */}
                        <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <button onClick={() => setSelectedTicket(null)} className="md:hidden mt-1 p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div className="space-y-1.5 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <StatusBadge status={ticketDetail.status} />
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${ticketDetail.priority === 'urgent' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                            {ticketDetail.priority}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-800 leading-snug">{ticketDetail.subject}</h2>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                                        <span className="flex items-center gap-1"><Hash size={11} className="text-indigo-600" /> TICK-{ticketDetail.id}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(ticketDetail.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 pt-2 xl:pt-0">
                                {isStaff && (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <UserCheck size={13} className="text-slate-500" />
                                            </div>
                                            <select
                                                className="bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 cursor-pointer px-3 py-2 text-slate-600"
                                                value={ticketDetail.assigned_to_id || ''}
                                                onChange={(e) => updateTicketAttribute({ assigned_to_id: e.target.value ? parseInt(e.target.value) : null })}
                                            >
                                                <option value="">Unassigned</option>
                                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                <Shield size={13} className="text-slate-500" />
                                            </div>
                                            <select
                                                className="bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 cursor-pointer px-3 py-2 text-slate-600"
                                                value={ticketDetail.status}
                                                onChange={(e) => updateTicketAttribute({ status: e.target.value })}
                                            >
                                                <option value="open">Open</option>
                                                <option value="in-progress">In Progress</option>
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
                            <div className="px-5 bg-slate-50/50 border-b border-slate-100 flex-shrink-0">
                                <TabsList className="bg-transparent gap-6 p-0 h-auto w-full md:w-auto overflow-x-auto scrollbar-hide flex-nowrap shrink-0">
                                    <TabsTrigger value="messages" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none px-0 py-4 text-xs font-semibold text-slate-400 data-[state=active]:text-slate-800 transition-colors border-b-2 border-transparent">
                                        <MessageSquare size={13} className="mr-1.5" /> Messages
                                    </TabsTrigger>
                                    {isStaff && (
                                        <TabsTrigger value="internal" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-amber-500 rounded-none px-0 py-4 text-xs font-semibold text-slate-400 data-[state=active]:text-amber-600 transition-colors border-b-2 border-transparent">
                                            <StickyNote size={13} className="mr-1.5" /> Internal Notes
                                        </TabsTrigger>
                                    )}
                                    <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-slate-800 rounded-none px-0 py-4 text-xs font-semibold text-slate-400 data-[state=active]:text-slate-800 transition-colors border-b-2 border-transparent">
                                        <History size={13} className="mr-1.5" /> Activity
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 min-h-0 flex flex-col">
                                <TabsContent value="messages" className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden m-0">
                                    <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 scrollbar-hide">
                                        {/* Initial Request Description */}
                                        {ticketDetail.description && (
                                            <div className="max-w-2xl mx-auto w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 border border-indigo-100">
                                                        <User size={12} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-700">{ticketDetail.user?.name}</p>
                                                        <p className="text-xs text-slate-400">{new Date(ticketDetail.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                                                    </div>
                                                    <span className="ml-auto text-xs font-medium text-indigo-500 flex items-center gap-1">
                                                        <Sparkles size={10} /> Initial Request
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 leading-relaxed pl-8">
                                                    {ticketDetail.description}
                                                </p>
                                            </div>
                                        )}

                                        {/* Interaction Thread */}
                                        <div className="space-y-3 max-w-3xl mx-auto w-full">
                                            {messages.map((m, idx) => {
                                                const isSupportMsg = m.is_admin;
                                                return (
                                                    <div key={m.id} className={`flex flex-col ${isSupportMsg ? 'items-start' : 'items-end'}`}>
                                                        <div className={`flex items-center gap-1.5 mb-1 px-1 ${isSupportMsg ? 'flex-row' : 'flex-row-reverse'}`}>
                                                            <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-medium ${isSupportMsg
                                                                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                                : 'bg-slate-100 text-slate-600'
                                                                }`}>
                                                                {isSupportMsg ? <Shield size={10} /> : (m.sender?.name?.[0] || 'U')}
                                                            </div>
                                                            <span className="text-xs font-medium text-slate-500">
                                                                {isSupportMsg ? (m.sender?.name || 'Support Team') : (m.sender?.name || ticketDetail.user?.name || 'You')}
                                                            </span>
                                                            <span className="text-xs text-slate-400">
                                                                {new Date(m.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                            </span>
                                                        </div>
                                                        <div className={`px-4 py-3 rounded-xl max-w-[78%] ${isSupportMsg
                                                            ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                                                            : 'bg-indigo-600 text-white rounded-tr-sm'
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
                                        <div className="flex-shrink-0 p-4 border-t border-slate-100 bg-white">
                                            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 transition-colors">
                                                <textarea
                                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 min-h-[40px] max-h-[140px] resize-none leading-relaxed placeholder:text-slate-400"
                                                    placeholder="Type your response..."
                                                    value={newMessage}
                                                    onChange={(e) => setNewMessage(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(false); } }}
                                                />
                                                <button
                                                    onClick={() => handleSendMessage(false)}
                                                    disabled={!newMessage.trim()}
                                                    className="flex-shrink-0 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Send size={15} />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1.5 px-1">Press Enter to send · Shift+Enter for new line</p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="internal" className="flex-1 min-h-0 flex flex-col data-[state=inactive]:hidden m-0">
                                    <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3 scrollbar-hide">
                                        {ticketDetail.internalNotes?.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                                                <StickyNote size={36} className="mb-4 stroke-1 text-slate-400" />
                                                <p className="text-xs font-medium text-slate-400">No internal notes yet</p>
                                            </div>
                                        ) : (
                                            <div className="max-w-3xl mx-auto space-y-3">
                                                {ticketDetail.internalNotes?.map(note => (
                                                    <div key={note.id} className="bg-amber-50/50 border border-amber-100 p-5 rounded-xl">
                                                        <p className="text-sm text-amber-900 leading-relaxed font-medium">"{note.note}"</p>
                                                        <div className="mt-3 pt-3 border-t border-amber-200/50 text-xs font-medium text-amber-600/70 flex items-center justify-between">
                                                            <span className="flex items-center gap-1.5"><User size={11} /> Staff Note</span>
                                                            <span>{new Date(note.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 p-4 border-t border-amber-100 bg-amber-50/30">
                                        <div className="flex items-end gap-2 bg-white border border-amber-200 rounded-lg p-2.5 focus-within:ring-2 focus-within:ring-amber-100 transition-colors">
                                            <textarea
                                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm p-1 min-h-[40px] max-h-[120px] resize-none leading-relaxed placeholder:text-slate-400"
                                                placeholder="Add internal note (staff only)..."
                                                value={newInternalNote}
                                                onChange={(e) => setNewInternalNote(e.target.value)}
                                            />
                                            <button
                                                onClick={() => handleSendMessage(true)}
                                                disabled={!newInternalNote.trim()}
                                                className="flex-shrink-0 p-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <Plus size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="activity" className="flex-1 min-h-0 overflow-y-auto p-6 m-0 scrollbar-hide data-[state=inactive]:hidden">
                                    <div className="max-w-2xl mx-auto space-y-6 relative">
                                        <div className="absolute left-5 top-2 bottom-2 w-[2px] bg-slate-100 rounded-full" />
                                        {ticketDetail.activities?.map((activity, idx) => (
                                            <div key={activity.id} className="relative pl-14">
                                                <div className={`absolute left-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 border-white z-10 ${activity.type === 'status_change' ? 'bg-indigo-600' :
                                                    activity.type === 'assignment' ? 'bg-amber-500' : 'bg-slate-400'
                                                    }`} />
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5">
                                                    <p className="text-sm font-semibold text-slate-700 leading-snug">{activity.description}</p>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                                                        {activity.actor_name}
                                                        {activity.is_admin && <Shield size={10} className="text-indigo-500" />}
                                                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                        {new Date(activity.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="relative pl-14">
                                            <div className="absolute left-5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white z-10" />
                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 opacity-70">
                                                <p className="text-xs font-medium text-slate-500">
                                                    Ticket created by <span className="font-semibold text-slate-700">{ticketDetail.user?.name}</span>
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <Shield size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">New Support Request</h3>
                                        <p className="text-xs text-slate-400 mt-0.5">Describe your issue and we'll get back to you</p>
                                    </div>
                                </div>
                                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Subject</label>
                                    <input
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                        placeholder="Brief summary of the issue"
                                        value={newTicket.subject}
                                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Priority</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
                                            value={newTicket.priority}
                                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Critical</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-600">Category</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors"
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
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-600">Description</label>
                                    <textarea
                                        rows={5}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none transition-colors"
                                        placeholder="Describe the issue in detail..."
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
                                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Submit Request <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
