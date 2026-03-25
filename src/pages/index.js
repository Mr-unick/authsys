import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    CheckCircle2, ArrowRight, Zap, Shield, BarChart3, Users,
    Layers, Globe, Target, AlertCircle, Mail, Phone, PlayCircle,
    Activity, GitBranch, Lock, Sparkles, TrendingUp, ChevronRight,
    Star, MessageSquare, Building2, X
} from "lucide-react";
import { useRouter } from 'next/router';
import axios from 'axios';

const FEATURES = [
    {
        icon: <Zap size={20} />,
        label: "Automation",
        title: "Live Lead Sync",
        desc: "Deep integrations with Meta & Google Ads. Leads appear the second they hit submit — zero manual entry.",
        accent: "indigo",
    },
    {
        icon: <GitBranch size={20} />,
        label: "Multi-Branch",
        title: "Branch Manager",
        desc: "Manage 1 branch or 1,000. Distinct views for branch admins and HQ with role-based access.",
        accent: "violet",
    },
    {
        icon: <BarChart3 size={20} />,
        label: "Analytics",
        title: "Deep Analytics",
        desc: "Leaderboards, conversion rates, and performance pulse reports. Grow with data, not guesses.",
        accent: "emerald",
    },
    {
        icon: <Lock size={20} />,
        label: "Security",
        title: "RBAC Controls",
        desc: "Granular permissions for sales staff, branch admins, and support. Every role, locked down.",
        accent: "amber",
    },
    {
        icon: <Target size={20} />,
        label: "Distribution",
        title: "Round Robin",
        desc: "Auto-distribute leads to the right salesperson instantly and fairly. No micromanagement.",
        accent: "rose",
    },
    {
        icon: <MessageSquare size={20} />,
        label: "Support",
        title: "Help Desk",
        desc: "Built-in ticketing system for multi-tenant users. Resolve issues faster, retain customers longer.",
        accent: "sky",
    },
];

const STATS = [
    { number: "500+", label: "Enterprise Teams" },
    { number: "40%", label: "Avg Conversion Boost" },
    { number: "2M+", label: "Leads Processed" },
    { number: "99.9%", label: "Uptime SLA" },
];

// ── Tier-based (quantity) features ──────────────────────────────────────────
const TIER_FEATURES = [
    {
        id: 'branches',
        icon: <GitBranch size={16} />,
        name: 'Branch Count',
        desc: 'Number of business branches / locations.',
        tiers: [
            { label: '1 Branch', price: 0, value: 1 },
            { label: '3 Branches', price: 799, value: 3 },
            { label: '10 Branches', price: 1999, value: 10 },
            { label: 'Unlimited', price: 3999, value: Infinity },
        ],
        defaultTier: 0,
    },
    {
        id: 'users',
        icon: <Users size={16} />,
        name: 'User Limit',
        desc: 'Team members / sales agents on your account.',
        tiers: [
            { label: '3 Users', price: 0, value: 3 },
            { label: '10 Users', price: 699, value: 10 },
            { label: '25 Users', price: 1499, value: 25 },
            { label: 'Unlimited', price: 2999, value: Infinity },
        ],
        defaultTier: 0,
    },
    {
        id: 'stages',
        icon: <Layers size={16} />,
        name: 'Custom Lead Stages',
        desc: 'Pipeline stages tailored to your sales process.',
        tiers: [
            { label: '5 Stages', price: 0, value: 5 },
            { label: '15 Stages', price: 399, value: 15 },
            { label: 'Unlimited', price: 799, value: Infinity },
        ],
        defaultTier: 0,
    },
    {
        id: 'webhooks',
        icon: <Zap size={16} />,
        name: 'Webhooks',
        desc: 'Outbound webhooks to connect with external apps.',
        tiers: [
            { label: '3 Webhooks', price: 0, value: 3 },
            { label: '10 Webhooks', price: 399, value: 10 },
            { label: 'Unlimited', price: 799, value: Infinity },
        ],
        defaultTier: 0,
    },
];

// ── Toggle (on/off) integration features ─────────────────────────────────────
const TOGGLE_FEATURES = [
    {
        id: 'fb',
        icon: <span className="text-[13px] font-black">f</span>,
        name: 'Facebook Lead Sync',
        desc: 'Pull leads from Facebook Lead Ads in real-time.',
        price: 799,
        category: 'Social',
    },
    {
        id: 'insta',
        icon: <span className="text-[13px] font-black">IG</span>,
        name: 'Instagram Lead Sync',
        desc: 'Capture leads from Instagram Ads automatically.',
        price: 799,
        category: 'Social',
    },
    {
        id: 'linkedin',
        icon: <span className="text-[13px] font-black">in</span>,
        name: 'LinkedIn Lead Gen',
        desc: 'Import LinkedIn Lead Gen Form submissions.',
        price: 999,
        category: 'Social',
    },
    {
        id: 'whatsapp',
        icon: <span className="text-[13px] font-black">WA</span>,
        name: 'WhatsApp Notifications',
        desc: 'Send automated WhatsApp messages on lead events.',
        price: 599,
        category: 'Messaging',
    },
    {
        id: 'analytics',
        icon: <BarChart3 size={16} />,
        name: 'Deep Analytics',
        desc: 'Conversion leaderboards, pipeline reports, performance pulse.',
        price: 1299,
        category: 'Intelligence',
    },
    {
        id: 'roundrobin',
        icon: <Target size={16} />,
        name: 'Round-Robin Engine',
        desc: 'Auto-assign leads to agents fairly and instantly.',
        price: 799,
        category: 'Automation',
    },
    {
        id: 'helpdesk',
        icon: <MessageSquare size={16} />,
        name: 'Help Desk',
        desc: 'Full ticketing system with internal notes, audit trail & SLA.',
        price: 999,
        category: 'Support',
    },
    {
        id: 'rbac',
        icon: <Lock size={16} />,
        name: 'RBAC & Permissions',
        desc: 'Granular role-based access control for every team member.',
        price: 699,
        category: 'Security',
    },
];

// Fallback / Initial default pricing data
const DEFAULT_TIER_FEATURES = TIER_FEATURES;
const DEFAULT_TOGGLE_FEATURES = TOGGLE_FEATURES;
const DEFAULT_BASE_PRICE = 999;

export default function Home() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState(0);

    const [pricing, setPricing] = React.useState({
        basePrice: DEFAULT_BASE_PRICE,
        tierFeatures: DEFAULT_TIER_FEATURES,
        toggleFeatures: DEFAULT_TOGGLE_FEATURES
    });

    // tier selections: { featureId -> tierIndex }
    const [tierSelections, setTierSelections] = React.useState(
        Object.fromEntries(DEFAULT_TIER_FEATURES.map(f => [f.id, 0]))
    );
    // toggle selections: Set of enabled feature IDs
    const [enabledToggles, setEnabledToggles] = React.useState(new Set());

    const [isPricingModalOpen, setIsPricingModalOpen] = React.useState(false);
    const [pricingForm, setPricingForm] = React.useState({
        name: '', email: '', mobile: '', business_name: ''
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const setTier = (id, idx) => setTierSelections(prev => ({ ...prev, [id]: idx }));
    const toggleAddon = (id) => setEnabledToggles(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const tierTotal = pricing.tierFeatures.reduce((sum, f) => {
        const selIdx = tierSelections[f.id] || 0;
        return sum + (f.tiers[selIdx]?.price || 0);
    }, 0);
    const toggleTotal = pricing.toggleFeatures.filter(f => enabledToggles.has(f.id)).reduce((sum, f) => sum + f.price, 0);
    const totalPrice = pricing.basePrice + tierTotal + toggleTotal;
    const enabledCount = enabledToggles.size;

    const handlePricingSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('/api/pricing-requests', {
                ...pricingForm,
                selected_features: {
                    tiers: tierSelections,
                    toggles: Array.from(enabledToggles)
                },
                total_price: totalPrice
            });
            setIsPricingModalOpen(false);
            setPricingForm({ name: '', email: '', mobile: '', business_name: '' });
            alert("Pricing request submitted successfully!");
        } catch (error) {
            console.error("Pricing submission failed:", error);
            alert("Failed to submit pricing request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    React.useEffect(() => {
        const loadPricing = async () => {
            try {
                const res = await axios.get('/api/get-pricing');
                if (res.data.data) {
                    const data = res.data.data;
                    setPricing({
                        basePrice: data.BASE_PRICE,
                        tierFeatures: data.TIER_FEATURES,
                        toggleFeatures: data.TOGGLE_FEATURES
                    });
                    // Re-sync icon mapping if needed, but here we assume icons are component-side
                }
            } catch (e) {
                console.error("Failed to load live pricing, using defaults.");
            }
        };
        loadPricing();
    }, []);

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/isauthenticated', {
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 401
                });
                if (response.status === 200) router.push('/crm');
            } catch (error) {
                if (error.response?.status !== 401) console.error("Auth check failed:", error);
            }
        };
        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen bg-[#080C14] text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Head>
                <title>Lead Converter | Next-Gen CRM for Modern Businesses</title>
                <meta name="description" content="Automate your lead lifecycle, manage multiple branches, and boost conversions with Lead Converter CRM." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            {/* ── NAV ── */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06]" style={{ background: 'rgba(8,12,20,0.8)', backdropFilter: 'blur(20px)' }}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Layers size={16} className="text-white" />
                        </div>
                        <span className="text-[15px] font-bold tracking-tight text-white">Lead Converter</span>
                    </div>
                    <div className="hidden md:flex items-center gap-7 text-sm text-slate-400 font-medium">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#product" className="hover:text-white transition-colors">Product</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#" className="hover:text-white transition-colors">Docs</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/signin" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</Link>
                        <Link href="/signin" className="flex items-center gap-1.5 bg-white text-[#080C14] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                            Get started <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-20" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.4) 0%, transparent 70%)' }} />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
                </div>

                <div className="max-w-5xl mx-auto text-center relative">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Now with AI-powered lead scoring
                        <ChevronRight size={12} className="text-indigo-400" />
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
                        The CRM that{' '}
                        <span className="relative">
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">actually converts</span>
                            <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-indigo-500/0 via-violet-500/50 to-indigo-500/0" />
                        </span>
                        {' '}leads.
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                        Automate your lead lifecycle from ad click to closed deal. Built for multi-branch organizations that need real-time intelligence and control.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
                        <Link href="/signin" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                            Start for free <ArrowRight size={15} />
                        </Link>
                        <button className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all">
                            <PlayCircle size={15} className="text-slate-400" /> Watch demo
                        </button>
                    </div>

                    {/* Social proof */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
                            <span className="ml-1">4.9/5 from 200+ reviews</span>
                        </div>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                        <span>No credit card required</span>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
                        <span>14-day free trial</span>
                    </div>
                </div>

                {/* Dashboard preview */}
                <div className="max-w-6xl mx-auto mt-20 relative">
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0D1220] shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                        {/* Fake browser chrome */}
                        <div className="h-10 bg-[#111827] border-b border-white/[0.06] flex items-center gap-2 px-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                                <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                            </div>
                            <div className="flex-1 mx-4 h-5 bg-white/5 rounded-md flex items-center px-3 gap-2">
                                <Globe size={10} className="text-slate-600" />
                                <span className="text-[10px] text-slate-600">app.leadconverter.io/dashboard</span>
                            </div>
                        </div>
                        <img src="/dashboard.png" alt="Lead Converter Dashboard" className="w-full h-auto" />
                    </div>

                    {/* Floating cards */}
                    <div className="absolute -left-6 top-1/3 hidden lg:flex items-center gap-3 bg-[#0D1220] border border-white/10 rounded-2xl p-4 shadow-xl">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Conversions</p>
                            <p className="text-base font-bold text-white">+42% this month</p>
                        </div>
                    </div>

                    <div className="absolute -right-6 bottom-1/4 hidden lg:flex items-center gap-3 bg-[#0D1220] border border-white/10 rounded-2xl p-4 shadow-xl">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <Activity size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Live Sync</p>
                            <p className="text-base font-bold text-white">3 new leads</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── LOGOS ── */}
            <section className="py-14 border-y border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <p className="text-xs font-semibold text-slate-600 uppercase tracking-[0.2em] mb-8">Trusted by 500+ revenue teams worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16">
                        {['Google Ads', 'Meta Ads', 'WhatsApp', 'Salesforce', 'HubSpot', 'Zapier'].map(brand => (
                            <span key={brand} className="text-lg font-black tracking-tighter text-slate-700 hover:text-slate-500 transition-colors cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((s, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                            <div className="text-4xl font-black text-white mb-2">{s.number}</div>
                            <div className="text-sm text-slate-500 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 rounded-full px-3 py-1 text-xs font-medium text-indigo-400 mb-4">
                            Platform Core
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                            Everything to scale<br />your sales engine.
                        </h2>
                        <p className="text-slate-400 text-lg">One platform. Every tool your sales and support team needs to ship faster and convert more.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FEATURES.map((f, i) => (
                            <div key={i} className="group relative p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 mb-5">
                                        {f.icon}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 mb-1">{f.label}</div>
                                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PRODUCT SHOWCASE ── */}
            <section id="product" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(99,102,241,0.08) 0%, transparent 100%)' }} />

                <div className="max-w-7xl mx-auto relative">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 mb-4">
                            Product Experience
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                            Designed for peak performance.
                        </h2>
                        <p className="text-slate-400 text-lg">A premium workspace that focuses on what matters: your conversion rate.</p>
                    </div>

                    {/* Tabbed screenshots */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {['Executive Dashboard', 'Lead Pipeline', 'Branch Overview'].map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === i ? 'bg-white text-[#080C14]' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-indigo-500/10 to-transparent" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_40px_80px_rgba(0,0,0,0.5)] bg-[#0D1220]">
                            <div className="h-10 bg-[#111827] border-b border-white/[0.06] flex items-center gap-2 px-4">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                                </div>
                                <div className="flex-1 mx-4 h-5 bg-white/5 rounded-md flex items-center px-3">
                                    <span className="text-[10px] text-slate-600">app.leadconverter.io</span>
                                </div>
                            </div>
                            <img src="/ai.jpg" alt="Platformmmmmmmmmmmm" className="w-full h-auto animate-in fade-in duration-300" key={activeTab} />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY US ── */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 border border-red-500/20 bg-red-500/10 rounded-full px-3 py-1 text-xs font-medium text-red-400 mb-6">
                                The Problem
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-8 leading-tight">
                                Your current system<br />
                                <span className="text-slate-600">is leaking revenue.</span>
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Manual Data Entry", desc: "Copy-pasting leads from Meta/Google is slow and error-prone. You lose 30 minutes per day, every day." },
                                    { title: "Lead Ghosting", desc: "Untracked leads fall through the cracks. If follow-up takes more than 5 minutes, you lose 80% of conversions." },
                                    { title: "Multi-Branch Chaos", desc: "No visibility into how individual branches are performing. Head office is flying blind." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
                                            <AlertCircle size={15} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1 text-sm">{item.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] space-y-4">
                            <div className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-6">The old way vs Lead Converter</div>
                            {[
                                { old: "Manual copy-paste from ads", new: "Real-time automated sync" },
                                { old: "Leads fall through cracks", new: "Zero-miss round-robin assign" },
                                { old: "Spreadsheets per branch", new: "Unified multi-branch dashboard" },
                                { old: "Guessing conversion rates", new: "Live AI-powered analytics" },
                                { old: "Email threads for support", new: "Built-in help desk ticketing" },
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                                        <span className="w-4 h-4 rounded-full border border-red-500/30 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        </span>
                                        <span className="text-xs text-slate-500 font-medium">{row.old}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                                        <span className="text-xs text-slate-300 font-medium">{row.new}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRICING ── */}
            <section id="pricing" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(99,102,241,0.08) 0%, transparent 100%)' }} />

                <div className="max-w-6xl mx-auto relative">
                    {/* Header */}
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 rounded-full px-3 py-1 text-xs font-medium text-indigo-400 mb-4">
                            Build Your Plan
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                            Pay only for what<br />you actually use.
                        </h2>
                        <p className="text-slate-400 text-lg">Configure every dimension — branches, users, integrations. Your stack, your price.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* ── Left: Configurator panels ── */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Base */}
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Base Plan</p>
                                        <p className="text-sm font-semibold text-white mt-0.5">Core CRM</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-slate-600">Always included</p>
                                        <p className="text-base font-black text-indigo-400">₹{pricing.basePrice.toLocaleString('en-IN')}<span className="text-xs font-medium text-slate-500">/mo</span></p>
                                    </div>
                                </div>
                                <div className="px-5 py-3 flex flex-wrap gap-2">
                                    {['Lead Dashboard', 'Board & Table View', 'Source Tracking', 'Basic Reports', 'Email Support'].map(f => (
                                        <span key={f} className="text-[11px] font-medium text-slate-500 bg-white/5 border border-white/[0.07] px-2.5 py-1 rounded-full">{f}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Capacity Tier Selectors */}
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/[0.06]">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Capacity</p>
                                    <p className="text-sm text-slate-400 mt-0.5">Scale each dimension to your team size.</p>
                                </div>
                                <div className="divide-y divide-white/[0.05]">
                                    {pricing.tierFeatures.map((feat) => {
                                        const selIdx = tierSelections[feat.id] || 0;
                                        // Map the icons back since they come as JSX in the original array but maybe not from API
                                        const iconMap = {
                                            'branches': <GitBranch size={16} />,
                                            'users': <Users size={16} />,
                                            'stages': <Layers size={16} />,
                                            'webhooks': <Zap size={16} />
                                        };
                                        const icon = iconMap[feat.id] || <Layers size={16} />;

                                        return (
                                            <div key={feat.id} className="px-5 py-4">
                                                <div className="flex items-start justify-between mb-3 gap-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                                                            {icon}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-semibold text-white leading-none">{feat.name}</p>
                                                            <p className="text-[11px] text-slate-600 mt-0.5">{feat.desc}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        {(feat.tiers[selIdx]?.price || 0) === 0
                                                            ? <span className="text-sm font-bold text-emerald-400">Free</span>
                                                            : <span className="text-sm font-bold text-white">+₹{(feat.tiers[selIdx]?.price || 0).toLocaleString('en-IN')}<span className="text-xs font-normal text-slate-500">/mo</span></span>
                                                        }
                                                    </div>
                                                </div>
                                                {/* Tier pills */}
                                                <div className="flex flex-wrap gap-2">
                                                    {feat.tiers.map((tier, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setTier(feat.id, i)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${selIdx === i
                                                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                                : 'bg-white/5 border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
                                                                }`}
                                                        >
                                                            {tier.label}
                                                            {tier.price === 0 && i !== 0 ? '' : ''}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Add-on Integrations & Features */}
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/[0.06]">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">Add-ons & Integrations</p>
                                    <p className="text-sm text-slate-400 mt-0.5">Toggle what you need. Click to add or remove.</p>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {TOGGLE_FEATURES.map((feat) => {
                                        const on = enabledToggles.has(feat.id);
                                        return (
                                            <button
                                                key={feat.id}
                                                onClick={() => toggleAddon(feat.id)}
                                                className={`relative text-left p-4 rounded-xl border transition-all duration-150 ${on
                                                    ? 'border-indigo-500/40 bg-indigo-500/8'
                                                    : 'border-white/[0.07] bg-white/[0.01] hover:border-white/[0.15]'
                                                    }`}
                                            >
                                                {/* Toggle dot */}
                                                <div className={`absolute top-3.5 right-3.5 w-8 h-4.5 rounded-full border flex items-center transition-all px-0.5 ${on ? 'border-indigo-500 bg-indigo-600' : 'border-white/20 bg-white/5'}`}
                                                    style={{ height: '18px', width: '32px' }}>
                                                    <div className={`w-3 h-3 rounded-full bg-white shadow transition-all duration-200 ${on ? 'translate-x-3.5' : 'translate-x-0'}`} />
                                                </div>

                                                <div className="flex items-center gap-2 mb-2 pr-10">
                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] border transition-colors ${on ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                                                        {feat.icon}
                                                    </div>
                                                    <p className="text-xs font-bold text-white">{feat.name}</p>
                                                </div>
                                                <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{feat.desc}</p>
                                                <p className={`text-xs font-bold ${on ? 'text-indigo-300' : 'text-slate-600'}`}>
                                                    +₹{feat.price.toLocaleString('en-IN')}<span className="font-normal">/mo</span>
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Live Summary Panel ── */}
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                                {/* Header */}
                                <div className="px-5 py-4 border-b border-white/[0.06]">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1">Your Configuration</p>
                                    <p className="text-sm text-slate-400">{enabledCount} add-on{enabledCount !== 1 ? 's' : ''} active</p>
                                </div>

                                {/* Breakdown */}
                                <div className="px-5 py-4 space-y-2.5">
                                    {/* Base */}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 font-medium">Core CRM</span>
                                        <span className="text-slate-400 tabular-nums">₹{pricing.basePrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    {/* Tier lines */}
                                    {pricing.tierFeatures.map(f => {
                                        const t = f.tiers[tierSelections[f.id] || 0];
                                        if (!t || t.price === 0) return null;
                                        return (
                                            <div key={f.id} className="flex justify-between text-sm">
                                                <span className="text-slate-400 font-medium">{f.name} <span className="text-slate-600">({t.label})</span></span>
                                                <span className="text-slate-400 tabular-nums">+₹{t.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        );
                                    })}
                                    {/* Toggle lines */}
                                    {pricing.toggleFeatures.filter(f => enabledToggles.has(f.id)).map(f => (
                                        <div key={f.id} className="flex justify-between text-sm">
                                            <span className="text-slate-400 font-medium">{f.name}</span>
                                            <span className="text-slate-400 tabular-nums">+₹{f.price.toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                    {tierTotal === 0 && enabledCount === 0 && (
                                        <p className="text-xs text-slate-700 italic">Upgrade capacity or add integrations above.</p>
                                    )}
                                </div>

                                {/* Total */}
                                <div className="px-5 py-4 border-t border-white/[0.06] bg-white/[0.02]">
                                    <div className="flex items-end justify-between mb-1">
                                        <p className="text-xs text-slate-500 font-medium">Monthly Total</p>
                                        {totalPrice > pricing.basePrice && (
                                            <p className="text-[10px] text-emerald-400 font-bold">Save 10% annually</p>
                                        )}
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-5">
                                        <span className="text-4xl font-black text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                                        <span className="text-slate-500 text-sm">/mo</span>
                                    </div>
                                    <Link
                                        href="/signin"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-[0_0_25px_rgba(99,102,241,0.3)]"
                                    >
                                        Get started <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>

                            {/* Trust */}
                            <div className="flex items-start gap-2 px-1">
                                <Shield size={13} className="text-slate-700 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-slate-700 leading-relaxed">No contracts. Switch or cancel anytime. 14-day free trial on all plans.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-white/[0.02] p-12 lg:p-20 text-center">
                        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                        <div className="relative">
                            <div className="inline-flex items-center gap-2 border border-indigo-500/20 bg-indigo-500/10 rounded-full px-3 py-1 text-xs font-medium text-indigo-400 mb-6">
                                <Sparkles size={11} /> Limited time — Free setup included
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
                                Ready to stop losing<br />leads to competitors?
                            </h2>
                            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
                                Join 500+ businesses that have increased their lead conversion by 40% with Lead Converter.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/signin" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                                    Start for free today <ArrowRight size={16} />
                                </Link>
                                <button onClick={() => setIsPricingModalOpen(true)} className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all">
                                    Talk to sales
                                </button>
                            </div>
                            <p className="text-sm text-slate-600 mt-6">No credit card required · 14-day free trial · Cancel anytime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="border-t border-white/[0.06] py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Layers size={16} className="text-white" />
                                </div>
                                <span className="text-[15px] font-bold text-white">Lead Converter</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">Next-gen CRM for multi-branch organizations. Scale your sales without the stress.</p>
                            <div className="flex gap-3">
                                {[Mail, Phone, Globe].map((Icon, i) => (
                                    <div key={i} className="w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
                                        <Icon size={15} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Product</h5>
                            <ul className="space-y-3 text-sm font-medium text-slate-600">
                                {['Features', 'Integrations', 'Enterprise', 'Security', 'Changelog'].map(l => (
                                    <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Company</h5>
                            <ul className="space-y-3 text-sm font-medium text-slate-600">
                                {['About Us', 'Careers', 'Blog', 'Contact', 'Partners'].map(l => (
                                    <li key={l}><a href="#" className="hover:text-slate-300 transition-colors">{l}</a></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h5 className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">Stay Updated</h5>
                            <p className="text-sm text-slate-600 mb-4">Get the latest product updates and sales tips weekly.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="your@email.com" className="flex-1 bg-white/5 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors" />
                                <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors">
                                    <ArrowRight size={15} className="text-white" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.06] gap-4">
                        <p className="text-xs text-slate-700">© 2025 Lead Converter CRM. All rights reserved.</p>
                        <div className="flex gap-6 text-xs text-slate-700">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
                                <a key={l} href="#" className="hover:text-slate-400 transition-colors">{l}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Pricing Modal */}
            {isPricingModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
                    <div className="bg-[#0D1220] border border-white/10 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsPricingModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Request Custom Quote</h3>
                        <p className="text-sm text-slate-400 mb-6">Let us know exactly how to reach you so we can send your customized pricing and features plan.</p>
                        
                        <form onSubmit={handlePricingSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                                <input required type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.name} onChange={e => setPricingForm({ ...pricingForm, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email *</label>
                                <input required type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.email} onChange={e => setPricingForm({ ...pricingForm, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Mobile Number *</label>
                                <input required type="tel"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.mobile} onChange={e => setPricingForm({ ...pricingForm, mobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1.5">Business Name</label>
                                <input type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                    value={pricingForm.business_name} onChange={e => setPricingForm({ ...pricingForm, business_name: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-all mt-4"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
