import { useState, useEffect, useCallback } from 'react';
import { VerifyToken as verifyTokenInternal } from '../utils/VerifyToken';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Zap, Facebook, Linkedin, Globe, CheckCircle2, XCircle,
    AlertCircle, RefreshCw, Copy, Trash2, Settings, Clock,
    ChevronRight, Plus, Loader2, ShieldCheck, Webhook, MessageCircle, Mail, Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/components/ui/tabs';

// ─── Status pill component ──────────────────────────────────────
function StatusBadge({ status }) {
    const cfg = {
        connected: { color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle2 size={12} />, label: 'Connected' },
        disconnected: { color: 'bg-gray-100 text-gray-500 border-gray-200', icon: <XCircle size={12} />, label: 'Not connected' },
        expired: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <AlertCircle size={12} />, label: 'Token expired' },
        error: { color: 'bg-red-100 text-red-600 border-red-200', icon: <AlertCircle size={12} />, label: 'Error' },
    };
    const c = cfg[status] ?? cfg.disconnected;
    return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full border ${c.color}`}>
            {c.icon} {c.label}
        </span>
    );
}

// ─── Provider metadata ──────────────────────────────────────────
const PROVIDERS = [
    {
        key: 'meta',
        name: 'Facebook & Instagram Ads',
        description: 'Meta Lead Ads — real-time webhook delivery',
        icon: <Facebook size={22} className="text-blue-600" />,
        bg: 'bg-blue-50',
        connectUrl: '/api/integrations/connect/meta',
        badge: 'Webhook',
    },
    {
        key: 'linkedin',
        name: 'LinkedIn Lead Ads',
        description: 'LinkedIn Marketing API — polling every 15 min',
        icon: <Linkedin size={22} className="text-blue-700" />,
        bg: 'bg-blue-50',
        connectUrl: '/api/integrations/connect/linkedin',
        badge: 'Polling',
    },
    {
        key: 'custom',
        name: 'Custom Webhook / API',
        description: 'Generic endpoint — Zapier, REST, third-party apps',
        icon: <Webhook size={22} className="text-indigo-600" />,
        bg: 'bg-indigo-50',
        connectUrl: null,
        badge: 'API Key',
    },
    {
        key: 'whatsapp',
        name: 'WhatsApp Notifications',
        description: 'Get real-time alerts on WhatsApp when new leads arrive',
        icon: <MessageCircle size={22} className="text-emerald-500" />,
        bg: 'bg-emerald-50',
        connectUrl: null,
        badge: 'Automated',
    },
    {
        key: 'email',
        name: 'Bulk Email (SMTP)',
        description: 'Configure your own SMTP to send bulk emails to your leads',
        icon: <Mail size={22} className="text-blue-500" />,
        bg: 'bg-blue-50',
        connectUrl: null,
        badge: 'SMTP',
    },
];

const CRM_FIELDS = ['name', 'email', 'phone', 'address', 'notes', 'lead_source', 'city', 'state'];

// ─── Main page ──────────────────────────────────────────────────
export async function getServerSideProps(context) {
    const { req, res } = context;
    // Diagnostic check
    if (typeof verifyTokenInternal !== 'function') {
        throw new Error(`VerifyToken is not a function: type is ${typeof verifyTokenInternal}. Exports: ${JSON.stringify(Object.keys(require('../utils/VerifyToken')))}`);
    }

    try {
        // Mock a response object for VerifyToken since it expects API-like res.status().json()
        const mockRes = {
            status: () => ({ json: () => { } }),
            writableEnded: false
        };

        const user = await verifyTokenInternal(req, mockRes, 'integrations');

        if (!user || mockRes.writableEnded) {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            };
        }

        // Check if the user object returned has the required role/permission
        // The VerifyToken utility calls haspermission internally if policy is provided.
        // If it got here without mockRes.writableEnded being true, it's authorized.

        return {
            props: { user: JSON.parse(JSON.stringify(user)) },
        };
    } catch (err) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }
}

function IntegrationsPage() {
    const [integrations, setIntegrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [listView, setListView] = useState(false);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [mappings, setMappings] = useState([]);
    const [logs, setLogs] = useState({ syncLogs: [], webhookLogs: [] });
    const [saving, setSaving] = useState(false);
    const [assignment, setAssignment] = useState({ rule: null, users: [], stages: [] });
    const [whatsappConfig, setWhatsappConfig] = useState(null);
    const [emailConfig, setEmailConfig] = useState(null);
    const [bulkMail, setBulkMail] = useState({ subject: '', body: '' });

    const load = useCallback(async () => {
        try {
            const res = await axios.get('/api/integrations');
            setIntegrations(res.data.data ?? []);
        } catch {
            toast.error('Failed to load integrations');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const openDetail = async (provider, specificIntegration = null) => {
        const existing = specificIntegration || (provider.key !== 'custom' ? integrations.find((i) => i.provider === provider.key) : null);

        if (provider.key === 'custom' && !specificIntegration) {
            setListView(true);
            setSelected({ ...provider });
            return;
        }

        setSelected({ ...provider, integration: existing });
        setListView(false);
        setActiveTab('overview');
        if (existing) {
            const [mRes, lRes, aRes] = await Promise.all([
                axios.get(`/api/integrations/${existing.id}/mappings`).catch(() => ({ data: { data: [] } })),
                axios.get(`/api/integrations/logs?integrationId=${existing.id}`).catch(() => ({ data: { syncLogs: [], webhookLogs: [] } })),
                axios.get(`/api/integrations/${existing.id}/assignment`).catch(() => ({ data: { rule: null, users: [], stages: [] } })),
            ]);
            setMappings(mRes.data.data ?? []);
            setLogs(lRes.data);

            // If no rule exists, initialize a default skeleton
            const ruleData = aRes.data.rule || {
                strategy: 'round_robin',
                user_ids: '[]',
                stage_id: null,
                is_active: true
            };
            setAssignment({ ...aRes.data, rule: ruleData });

            if (provider.key === 'whatsapp') {
                setWhatsappConfig(existing.config || {
                    sender_type: 'crm',
                    welcome_message: 'Hello {{name}}, thanks for your interest!',
                    phone_number_id: '',
                    api_key: '',
                    is_active: true
                });
            }

            if (provider.key === 'email') {
                setEmailConfig(existing.config || {
                    smtp_host: '',
                    smtp_port: '587',
                    smtp_user: '',
                    smtp_pass: '',
                    from_name: 'LeadConverter',
                    from_email: '',
                    is_active: true
                });
            }
        } else {
            setMappings([
                { external_field: 'full_name', crm_field: 'name', transform: 'trim' },
                { external_field: 'email', crm_field: 'email', transform: 'lowercase' },
                { external_field: 'phone_number', crm_field: 'phone', transform: 'trim' },
            ]);
            setLogs({ syncLogs: [], webhookLogs: [] });

            if (provider.key === 'whatsapp') {
                setWhatsappConfig({
                    sender_type: 'crm',
                    welcome_message: 'Hello {{name}}, thanks for your interest!',
                    phone_number_id: '',
                    api_key: '',
                    is_active: true
                });
            }

            if (provider.key === 'email') {
                setEmailConfig({
                    smtp_host: '',
                    smtp_port: '587',
                    smtp_user: '',
                    smtp_pass: '',
                    from_name: 'LeadConverter',
                    from_email: '',
                    is_active: true
                });
            }
        }
    };

    const handleDisconnect = async () => {
        if (!selected?.integration) return;
        if (!confirm('Disconnect this integration? Existing imported leads will not be affected.')) return;
        await axios.put(`/api/integrations/${selected.integration.id}/disconnect`);
        toast.success('Integration disconnected');
        load();
        setSelected(null);
    };

    const handleSaveMappings = async () => {
        if (!selected?.integration) return;
        setSaving(true);
        try {
            await axios.post(`/api/integrations/${selected.integration.id}/mappings`, { mappings });
            toast.success('Mappings saved');
        } catch {
            toast.error('Failed to save mappings');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAssignment = async () => {
        if (!selected?.integration || !assignment.rule) return;

        let userIds;
        try {
            userIds = typeof assignment.rule.user_ids === 'string'
                ? JSON.parse(assignment.rule.user_ids)
                : assignment.rule.user_ids;
        } catch (e) {
            userIds = [];
        }

        if (!Array.isArray(userIds) || userIds.length === 0) {
            toast.warn('Please select at least one user for assignment');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...assignment.rule,
                user_ids: userIds // API expects array, but upsert handles stringify if needed.
            };
            await axios.post(`/api/integrations/${selected.integration.id}/assignment`, payload);
            toast.success('Assignment rules saved');
        } catch (err) {
            console.error('Assignment save error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || 'Failed to save assignment rules');
        } finally {
            setSaving(false);
        }
    };

    const handleRegenerateKey = async () => {
        if (!selected?.integration) return;
        const res = await axios.post(`/api/integrations/${selected.integration.id}/regenerate-key`);
        setIntegrations((prev) => prev.map((i) => i.id === selected.integration.id ? { ...i, api_key: res.data.api_key } : i));
        setSelected((s) => ({ ...s, integration: { ...s.integration, api_key: res.data.api_key } }));
        toast.success('API key regenerated');
    };

    const handleSaveWhatsappConfig = async () => {
        setSaving(true);
        try {
            await axios.post('/api/integrations/whatsapp/config', whatsappConfig);
            toast.success('WhatsApp configuration saved');
            await load();
            // Update selected integration with new config after load
            const res = await axios.get('/api/integrations');
            const updated = res.data.data.find(i => i.provider === 'whatsapp');
            if (updated) setSelected(s => ({ ...s, integration: updated }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveEmailConfig = async () => {
        setSaving(true);
        try {
            await axios.post('/api/integrations/email/config', emailConfig);
            toast.success('Email configuration saved');
            await load();
            const res = await axios.get('/api/integrations');
            const updated = res.data.data.find(i => i.provider === 'email');
            if (updated) setSelected(s => ({ ...s, integration: updated }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save configuration');
        } finally {
            setSaving(false);
        }
    };

    const handleSendBulkMail = async () => {
        if (!bulkMail.subject || !bulkMail.body) {
            toast.error("Subject and body are required");
            return;
        }
        setSaving(true);
        try {
            // Fetch all leads to get recipients
            const leadsRes = await axios.get('/api/leads');
            const recipients = leadsRes.data.data.map(l => l.email).filter(e => !!e);

            if (recipients.length === 0) {
                toast.error("No recipients found with email addresses");
                return;
            }

            const res = await axios.post('/api/mail/send-bulk', {
                subject: bulkMail.subject,
                body: bulkMail.body,
                recipients: recipients
            });
            toast.success(`Bulk mail process started. ${res.data.data.successful} sent successfully.`);
            setBulkMail({ subject: '', body: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send bulk mail');
        } finally {
            setSaving(false);
        }
    };

    const handleMockConnect = async () => {
        if (!selected) return;
        try {
            const res = await axios.post('/api/integrations/mock-connect', { provider: selected.key });
            await load();
            setSelected(s => ({ ...s, integration: res.data.data }));
            toast.success('Mock connection established (Dev Mode)');
        } catch {
            toast.error('Mock connect failed');
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const addMappingRow = () => setMappings((m) => [...m, { external_field: '', crm_field: 'name', transform: 'trim' }]);
    const removeMappingRow = (i) => setMappings((m) => m.filter((_, idx) => idx !== i));

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    // ── Detail panel ────────────────────────────────────────────
    if (selected) {
        const intg = selected.integration;
        return (
            <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 space-y-8 pb-32">
                {/* Back */}
                <button
                    onClick={() => {
                        if (selected.key === 'custom' && !listView && selected.integration) {
                            setListView(true);
                            setSelected(s => ({ ...s, integration: null }));
                        } else {
                            setSelected(null);
                            setListView(false);
                        }
                    }}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
                >
                    ← {(selected.key === 'custom' && !listView && selected.integration) ? 'Back to Custom Webhooks' : 'Back to Integrations'}
                </button>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${selected.bg}`}>{selected.icon}</div>
                        <div>
                            <h1 className="text-xl font-extrabold text-[#0F1626]">{selected.name}</h1>
                            <p className="text-sm text-gray-400">{selected.description}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!listView && <StatusBadge status={intg?.status ?? 'disconnected'} />}
                        {intg?.status === 'connected' && !listView ? (
                            <button
                                onClick={handleDisconnect}
                                className="text-xs font-bold text-red-600 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                            >
                                Disconnect
                            </button>
                        ) : (selected.key !== 'custom' && selected.key !== 'whatsapp') || listView ? (
                            <div className="flex flex-col gap-2">
                                {selected.connectUrl ? (
                                    <a
                                        href={selected.connectUrl}
                                        className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all text-center"
                                    >
                                        Connect →
                                    </a>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            const res = await axios.post('/api/integrations/create-custom');
                                            await load();
                                            const newIntg = res.data;
                                            openDetail(selected, newIntg);
                                            toast.success('Custom integration created');
                                        }}
                                        className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                                    >
                                        <Plus size={14} /> New Webhook
                                    </button>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                {listView && selected.key === 'custom' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {integrations.filter(i => i.provider === 'custom').map(intg => (
                            <Card key={intg.id} className="border border-gray-100 shadow-sm hover:border-indigo-300 transition-all group overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 grayscale group-hover:grayscale-0 transition-all">
                                                <Webhook size={20} />
                                            </div>
                                            <StatusBadge status={intg.status} />
                                        </div>
                                        <h3 className="font-bold text-[#0F1626] text-sm mb-1">{intg.display_name}</h3>
                                        <p className="text-[10px] text-gray-400 font-mono truncate">{intg.api_key ? '••••' + intg.api_key.slice(-8) : 'No Key'}</p>
                                    </div>
                                    <button
                                        onClick={() => openDetail(selected, intg)}
                                        className="w-full py-3 bg-gray-50 border-t border-gray-50 flex items-center justify-between px-5 text-xs font-bold text-indigo-600 group-hover:bg-indigo-50 transition-colors"
                                    >
                                        Manage Setup <ChevronRight size={14} />
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                        {integrations.filter(i => i.provider === 'custom').length === 0 && (
                            <div className="col-span-full py-20 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-4">
                                <div className="p-4 bg-white rounded-full shadow-sm text-gray-200"><Webhook size={40} /></div>
                                <div className="text-center">
                                    <p className="text-sm font-bold text-[#0F1626]">No Custom Webhooks</p>
                                    <p className="text-xs text-gray-400 mt-1">Create your first custom endpoint to start receiving leads.</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        const res = await axios.post('/api/integrations/create-custom');
                                        await load();
                                        openDetail(selected, res.data);
                                    }}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100"
                                >
                                    Create First Webhook
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats row */}
                {(intg || selected.key === 'whatsapp') && !listView && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                            { label: 'Leads Today', value: intg?.leads_today ?? 0 },
                            { label: 'Last Sync', value: intg?.last_sync ? new Date(intg.last_sync).toLocaleTimeString() : '—' },
                            { label: 'Sync Status', value: intg?.last_sync_status ?? '—' },
                            { label: 'Method', value: selected.badge },
                        ].map((s) => (
                            <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className="text-lg font-extrabold text-[#0F1626]">{s.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                {(intg || selected.key === 'whatsapp' || selected.key === 'email') && !listView && (
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full mb-4">
                            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                            {selected.key === 'email' && <TabsTrigger value="compose" className="flex-1">Compose</TabsTrigger>}
                            <TabsTrigger value="mappings" className="flex-1">Field Mapping</TabsTrigger>
                            <TabsTrigger value="assignment" className="flex-1">Auto Assignment</TabsTrigger>
                            <TabsTrigger value="logs" className="flex-1">Sync Logs</TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardContent className="p-5 space-y-4">
                                    {selected.key === 'custom' && intg && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-bold text-gray-700">Webhook Endpoint</h3>
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                                <code className="text-xs text-indigo-600 font-mono flex-1 break-all">
                                                    POST {typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/custom/{intg.business_id ?? '?'}/{intg.id ?? '?'}
                                                </code>
                                                <button onClick={() => copyToClipboard(`${window.location.origin}/api/webhooks/custom/${intg.business_id}/${intg.id}`)}>
                                                    <Copy size={14} className="text-gray-400 hover:text-indigo-600" />
                                                </button>
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-700">API Key</h3>
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                                <code className="text-xs text-gray-700 font-mono flex-1 break-all">{intg.api_key ?? '—'}</code>
                                                <button onClick={() => copyToClipboard(intg.api_key ?? '')}>
                                                    <Copy size={14} className="text-gray-400 hover:text-indigo-600" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={handleRegenerateKey}
                                                className="text-xs font-bold text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-all flex items-center gap-1.5"
                                            >
                                                <RefreshCw size={13} /> Regenerate Key
                                            </button>
                                            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100 mt-2">
                                                <p className="text-xs font-bold text-indigo-800 mb-2">Send leads via POST:</p>
                                                <pre className="text-[10px] text-indigo-700 leading-relaxed overflow-x-auto">{`curl -X POST \\
  ${typeof window !== 'undefined' ? window.location.origin : ''}/api/webhooks/custom/{tenant}/{id} \\
  -H "X-API-Key: YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"j@x.com","phone":"9999"}'`}</pre>
                                            </div>
                                        </div>
                                    )}
                                    {selected.key === 'whatsapp' && (
                                        <div className="space-y-6">
                                            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm"><MessageCircle size={18} /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-emerald-900">Configure WhatsApp Alerts</p>
                                                    <p className="text-[11px] text-emerald-700 mt-1 opacity-80">Choose how you want to receive lead notifications on WhatsApp.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sender Method</label>
                                                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-50 rounded-xl border border-gray-100">
                                                        <button
                                                            onClick={() => setWhatsappConfig(prev => ({ ...prev, sender_type: 'crm' }))}
                                                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${whatsappConfig?.sender_type === 'crm' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            CRM Shared
                                                        </button>
                                                        <button
                                                            onClick={() => setWhatsappConfig(prev => ({ ...prev, sender_type: 'business' }))}
                                                            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${whatsappConfig?.sender_type === 'business' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            My Business API
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Welcome Message Template</label>
                                                    <textarea
                                                        rows={3}
                                                        value={whatsappConfig?.welcome_message || ''}
                                                        onChange={(e) => setWhatsappConfig(prev => ({ ...prev, welcome_message: e.target.value }))}
                                                        placeholder="Hello {{name}}, thanks for your interest!"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all"
                                                    />
                                                    <p className="text-[9px] text-gray-400 px-1 italic">Use {'{{name}}'} as a placeholder for the lead's name.</p>
                                                </div>
                                            </div>

                                            {whatsappConfig?.sender_type === 'business' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Phone Number ID</label>
                                                        <input
                                                            type="text"
                                                            value={whatsappConfig?.phone_number_id || ''}
                                                            onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phone_number_id: e.target.value }))}
                                                            placeholder="Meta Phone Number ID"
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-all font-mono"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">System User Access Token</label>
                                                        <input
                                                            type="password"
                                                            value={whatsappConfig?.api_key || ''}
                                                            onChange={(e) => setWhatsappConfig(prev => ({ ...prev, api_key: e.target.value }))}
                                                            placeholder="EAAG...."
                                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-400 transition-all font-mono"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setWhatsappConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
                                                        className={`w-10 h-5 rounded-full relative transition-all ${whatsappConfig?.is_active ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${whatsappConfig?.is_active ? 'left-5' : 'left-1'}`} />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-600">Active Notifications</span>
                                                </div>
                                                <button
                                                    onClick={handleSaveWhatsappConfig}
                                                    disabled={saving}
                                                    className="bg-[#0F1626] text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save WhatsApp Configuration settings'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selected.key === 'email' && (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                                                <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm"><Mail size={18} /></div>
                                                <div>
                                                    <p className="text-sm font-bold text-blue-900">SMTP Server Configuration</p>
                                                    <p className="text-[11px] text-blue-700 mt-1 opacity-80">Setup your mail server details to enable bulk emailing features.</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">SMTP Host</label>
                                                    <input
                                                        type="text"
                                                        value={emailConfig?.smtp_host || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_host: e.target.value }))}
                                                        placeholder="smtp.gmail.com"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">SMTP Port</label>
                                                    <input
                                                        type="text"
                                                        value={emailConfig?.smtp_port || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_port: e.target.value }))}
                                                        placeholder="587"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">SMTP Username</label>
                                                    <input
                                                        type="text"
                                                        value={emailConfig?.smtp_user || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_user: e.target.value }))}
                                                        placeholder="your-email@gmail.com"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">SMTP Password</label>
                                                    <input
                                                        type="password"
                                                        value={emailConfig?.smtp_pass || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, smtp_pass: e.target.value }))}
                                                        placeholder="••••••••••••"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all font-mono"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sender Name</label>
                                                    <input
                                                        type="text"
                                                        value={emailConfig?.from_name || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, from_name: e.target.value }))}
                                                        placeholder="LeadConverter Team"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sender Email</label>
                                                    <input
                                                        type="email"
                                                        value={emailConfig?.from_email || ''}
                                                        onChange={(e) => setEmailConfig(prev => ({ ...prev, from_email: e.target.value }))}
                                                        placeholder="hello@leadconverter.ai"
                                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => setEmailConfig(prev => ({ ...prev, is_active: !prev.is_active }))}
                                                        className={`w-10 h-5 rounded-full relative transition-all ${emailConfig?.is_active ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                                    >
                                                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${emailConfig?.is_active ? 'left-5' : 'left-1'}`} />
                                                    </button>
                                                    <span className="text-xs font-bold text-gray-600">Enable Bulk Mail</span>
                                                </div>
                                                <button
                                                    onClick={handleSaveEmailConfig}
                                                    disabled={saving}
                                                    className="bg-[#0F1626] text-white px-8 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    {saving ? <Loader2 size={14} className="animate-spin" /> : 'Save SMTP Settings'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selected.key === 'meta' && (
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                <ShieldCheck size={18} className="text-blue-600 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-bold text-blue-800">Webhook endpoint registered</p>
                                                    <p className="text-xs mt-0.5">All new leads from your Facebook and Instagram ad forms are delivered in real-time via Meta's push webhook.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selected.key === 'linkedin' && (
                                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                            <p className="text-xs font-bold text-amber-800">Polling Mode</p>
                                            <p className="text-xs text-amber-700 mt-1">LinkedIn Lead Ads are synced every 15 minutes via the Marketing API. Real-time webhooks are not yet available for all LinkedIn accounts.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Compose Tab */}
                        {selected.key === 'email' && (
                            <TabsContent value="compose">
                                <Card className="border-none shadow-sm rounded-2xl">
                                    <CardContent className="p-6 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 shadow-sm"><Send size={18} /></div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Send Bulk Campaign</p>
                                                <p className="text-[11px] text-gray-400">This will be sent to all active leads with valid email addresses.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Email Subject</label>
                                                <input
                                                    type="text"
                                                    value={bulkMail.subject}
                                                    onChange={(e) => setBulkMail(prev => ({ ...prev, subject: e.target.value }))}
                                                    placeholder="Amazing Offer for our valued customers"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-all font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Message Body (HTML enabled)</label>
                                                <textarea
                                                    rows={10}
                                                    value={bulkMail.body}
                                                    onChange={(e) => setBulkMail(prev => ({ ...prev, body: e.target.value }))}
                                                    placeholder="<h1>Hello!</h1><p>We have a special announcement...</p>"
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition-all font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4 border-t border-gray-50">
                                            <button
                                                onClick={handleSendBulkMail}
                                                disabled={saving || !intg || intg.status !== 'connected'}
                                                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-10 py-3 rounded-xl text-sm font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-3"
                                            >
                                                {saving ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Send Now</>}
                                            </button>
                                        </div>
                                        {!intg || intg.status !== 'connected' && (
                                            <p className="text-[10px] text-center text-red-500 font-bold mt-2 uppercase tracking-tighter">Please configure and activate SMTP settings first</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        )}

                        {/* Field Mapping Tab */}
                        <TabsContent value="mappings">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardContent className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-gray-700">Field Mappings</h3>
                                        <button
                                            onClick={addMappingRow}
                                            className="flex items-center gap-1 text-xs font-bold text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-all"
                                        >
                                            <Plus size={13} /> Add Row
                                        </button>
                                    </div>

                                    {/* Header */}
                                    <div className="grid grid-cols-[1fr_1fr_100px_32px] gap-2 mb-2 px-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">External Field</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CRM Field</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transform</span>
                                        <span />
                                    </div>

                                    <div className="space-y-2">
                                        {mappings.map((m, i) => (
                                            <div key={i} className="grid grid-cols-[1fr_1fr_100px_32px] gap-2 items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                                                <input
                                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-mono focus:outline-none focus:border-indigo-400"
                                                    value={m.external_field}
                                                    onChange={(e) => setMappings((mp) => mp.map((x, idx) => idx === i ? { ...x, external_field: e.target.value } : x))}
                                                    placeholder="full_name"
                                                />
                                                <select
                                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-400"
                                                    value={m.crm_field}
                                                    onChange={(e) => setMappings((mp) => mp.map((x, idx) => idx === i ? { ...x, crm_field: e.target.value } : x))}
                                                >
                                                    {CRM_FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                                <select
                                                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-indigo-400"
                                                    value={m.transform ?? ''}
                                                    onChange={(e) => setMappings((mp) => mp.map((x, idx) => idx === i ? { ...x, transform: e.target.value } : x))}
                                                >
                                                    <option value="">none</option>
                                                    <option value="trim">trim</option>
                                                    <option value="lowercase">lowercase</option>
                                                    <option value="uppercase">uppercase</option>
                                                    <option value="split_name">split_name</option>
                                                </select>
                                                <button onClick={() => removeMappingRow(i)} className="text-red-400 hover:text-red-600 flex items-center justify-center">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={handleSaveMappings}
                                        disabled={saving || !intg}
                                        className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        Save Mappings
                                    </button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Assignment Tab */}
                        <TabsContent value="assignment">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardContent className="p-5 space-y-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-sm font-bold text-gray-700">Assignment Rules</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Rules Active</span>
                                            <button
                                                onClick={() => setAssignment(prev => ({ ...prev, rule: { ...prev.rule, is_active: !prev.rule?.is_active } }))}
                                                className={`w-10 h-5 rounded-full relative transition-colors ${assignment.rule?.is_active ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${assignment.rule?.is_active ? 'left-6' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-[11px] font-bold text-[#0F1626] mb-2">Strategy</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {[
                                            { id: 'round_robin', label: 'Round Robin', desc: 'Cycle through users' },
                                            { id: 'least_loaded', label: 'Least Loaded', desc: 'User with fewest leads' },
                                            { id: 'specific_user', label: 'Specific User', desc: 'Always the same person' },
                                        ].map((s) => (
                                            <button
                                                key={s.id}
                                                onClick={() => setAssignment(prev => ({ ...prev, rule: { ...prev.rule, strategy: s.id } }))}
                                                className={`text-left p-3 rounded-xl border transition-all ${assignment.rule?.strategy === s.id ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                            >
                                                <p className="text-xs font-bold text-[#0F1626]">{s.label}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{s.desc}</p>
                                            </button>
                                        ))}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Assignable Users</h3>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {assignment.users.map((u) => {
                                                const currentIds = JSON.parse(assignment.rule?.user_ids || '[]');
                                                const isChecked = currentIds.includes(u.id);
                                                return (
                                                    <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-700">{u.name}</p>
                                                            <p className="text-[10px] text-gray-400">{u.email} · {u.role?.name}</p>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                const nextIds = e.target.checked
                                                                    ? [...currentIds, u.id]
                                                                    : currentIds.filter(id => id !== u.id);
                                                                setAssignment(prev => ({ ...prev, rule: { ...prev.rule, user_ids: JSON.stringify(nextIds) } }));
                                                            }}
                                                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-1">Target Lead Stage</h3>
                                        <p className="text-[11px] text-gray-400 mb-3">Newly imported leads will be placed in this stage.</p>
                                        <select
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-indigo-400"
                                            value={assignment.rule?.stage_id || ''}
                                            onChange={(e) => setAssignment(prev => ({ ...prev, rule: { ...prev.rule, stage_id: parseInt(e.target.value) || null } }))}
                                        >
                                            <option value="">Default (New Leads)</option>
                                            {assignment.stages.map(s => (
                                                <option key={s.id} value={s.id}>{s.stage_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={handleSaveAssignment}
                                        disabled={saving || !selected?.integration}
                                        className="w-full bg-[#0F1626] hover:bg-black disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                                        Save Assignment Rules
                                    </button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Logs Tab */}
                        <TabsContent value="logs">
                            <Card className="border-none shadow-sm rounded-2xl">
                                <CardContent className="p-5 space-y-5">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Sync History</h3>
                                        {logs.syncLogs.length === 0 ? (
                                            <p className="text-xs text-gray-400 text-center py-6">No sync events yet</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {logs.syncLogs.map((l) => (
                                                    <div key={l.id} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                                        <span className={`w-2 h-2 rounded-full ${l.status === 'success' ? 'bg-green-500' : l.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-700">
                                                                {l.sync_type} · {l.leads_imported} imported · {l.leads_failed} failed · {l.leads_duplicate} dup
                                                            </p>
                                                            <p className="text-[10px] text-gray-400">{new Date(l.started_at).toLocaleString()}</p>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.status === 'success' ? 'bg-green-100 text-green-700' : l.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                                                            {l.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-3">Webhook Events</h3>
                                        {logs.webhookLogs.length === 0 ? (
                                            <p className="text-xs text-gray-400 text-center py-6">No webhook events yet</p>
                                        ) : (
                                            <div className="space-y-2">
                                                {logs.webhookLogs.map((l) => (
                                                    <div key={l.id} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                                        <span className={`w-2 h-2 rounded-full ${l.signature_valid ? 'bg-green-500' : 'bg-red-500'}`} />
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-700">{l.provider} · {l.event_type}</p>
                                                            <p className="text-[10px] text-gray-400">{new Date(l.received_at).toLocaleString()} · sig {l.signature_valid ? '✓' : '✗'}</p>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.processed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                            {l.processed ? 'ok' : 'pending'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div >
        );
    }

    // ── Provider grid ───────────────────────────────────────────
    return (
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#0F1626] p-3 rounded-2xl shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1626] tracking-tight">Integrations</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Connect your ad platforms to auto-import leads</p>
                </div>
            </div>

            {/* Provider cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {PROVIDERS.map((p) => {
                    const matched = integrations.filter((i) => i.provider === p.key);
                    const intg = matched[0];
                    const count = matched.length;

                    return (
                        <button
                            key={p.key}
                            onClick={() => openDetail(p)}
                            className="text-left bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200 overflow-hidden group"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${p.bg}`}>{p.icon}</div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <StatusBadge status={p.key === 'custom' && count > 0 ? 'connected' : (intg?.status ?? 'disconnected')} />
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                                            {p.key === 'custom' && count > 0 ? `${count} Active` : p.badge}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="font-bold text-[#0F1626] text-sm mb-1">{p.name}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>

                                {count > 0 && (
                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            <strong className="text-[#0F1626]">
                                                {matched.reduce((acc, curr) => acc + (curr.leads_today ?? 0), 0)}
                                            </strong> leads today
                                        </span>
                                        {intg?.last_sync && (
                                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                                <Clock size={9} />
                                                {new Date(intg.last_sync).toLocaleTimeString()}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="px-5 py-3 bg-gray-50 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700">
                                    {count > 0 ? (p.key === 'custom' ? 'Manage Hooks' : 'Configure') : 'Connect'}
                                </span>
                                <ChevronRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Summary stats */}
            {integrations.length > 0 && (
                <Card className="border-none shadow-sm rounded-2xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold text-gray-700">Today's Lead Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 overflow-x-auto scrollbar-hide">
                        <div className="flex flex-nowrap items-center justify-start gap-4">
                            {PROVIDERS.map((p) => {
                                const leadsToday = integrations
                                    .filter((i) => i.provider === p.key)
                                    .reduce((acc, curr) => acc + (curr.leads_today ?? 0), 0);
                                return (
                                    <div key={p.key} className="flex-none w-[110px] text-center px-2 py-3 bg-gray-50/50 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                                        <div className={`w-7 h-7 rounded-lg ${p.bg} flex items-center justify-center mx-auto mb-1.5`}>
                                            <span className="scale-[0.6]">{p.icon}</span>
                                        </div>
                                        <p className="text-lg font-black text-[#0F1626] leading-none mb-1">{leadsToday || 0}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate px-1">{p.key}</p>
                                    </div>
                                );
                            })}
                            <div className="flex-none w-[110px] text-center px-2 py-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50">
                                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center mx-auto mb-1.5">
                                    <Zap size={14} className="text-indigo-600" />
                                </div>
                                <p className="text-lg font-black text-indigo-900 leading-none mb-1">
                                    {integrations.reduce((s, i) => s + (i.leads_today ?? 0), 0)}
                                </p>
                                <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-tight">TOTAL</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default IntegrationsPage;
