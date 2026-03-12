import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    CheckCircle2, ArrowRight, Zap, Shield, BarChart3, Users,
    Layers, Globe, Target, AlertCircle, Mail, Phone, PlayCircle,
    Activity, GitBranch, Lock, Sparkles, TrendingUp, ChevronRight,
    Star, MessageSquare, Building2
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

const PRICING = [
    {
        name: "Starter",
        tier: "Small Teams",
        price: "$29",
        cta: "Start Free Trial",
        href: "/signin",
        featured: false,
        features: [
            "Single Branch Management",
            "Unified Lead Dashboard",
            "Table & Board Views",
            "Lead Source Tracking",
            "Email Support",
        ],
    },
    {
        name: "Professional",
        tier: "Growing Business",
        price: "$79",
        cta: "Start Growing Now",
        href: "/signin",
        featured: true,
        badge: "Most Popular",
        features: [
            "Up to 5 Business Branches",
            "Custom Lead Stages",
            "Meta & Google Ads Sync",
            "Integration Suite Access",
            "Automated Round-Robin",
            "Priority Ticket Support",
        ],
    },
    {
        name: "Enterprise",
        tier: "High Volume",
        price: "Custom",
        cta: "Talk to Sales",
        href: "/signin",
        featured: false,
        features: [
            "Unlimited Branch Network",
            "Area of Operation Control",
            "Real-time Activity Logs",
            "Sales Territory Mapping",
            "VIP Support & SLA",
            "Dedicated Success Manager",
        ],
    },
];

export default function Home() {
    const router = useRouter();
    const [activeTab, setActiveTab] = React.useState(0);

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
                            <img src="/dashboard.png" alt="Platform" className="w-full h-auto animate-in fade-in duration-300" key={activeTab} />
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
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.07) 0%, transparent 100%)' }} />

                <div className="max-w-6xl mx-auto relative">
                    <div className="max-w-2xl mx-auto text-center mb-16">
                        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs font-medium text-slate-400 mb-4">
                            Pricing
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-4">
                            Built for every stage of growth.
                        </h2>
                        <p className="text-slate-400 text-lg">Simple, transparent pricing. No surprises.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                        {PRICING.map((plan, i) => (
                            <div key={i} className={`relative rounded-2xl p-8 flex flex-col ${plan.featured
                                ? 'bg-indigo-600 border border-indigo-500/50 shadow-[0_0_80px_rgba(99,102,241,0.2)]'
                                : 'bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] transition-colors'
                                }`}>
                                {plan.badge && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wide px-3 py-1 rounded-full">
                                        {plan.badge}
                                    </div>
                                )}
                                <div className={`text-[10px] font-bold uppercase tracking-[0.15em] mb-1 ${plan.featured ? 'text-indigo-200' : 'text-slate-600'}`}>{plan.tier}</div>
                                <h3 className="text-xl font-bold text-white mb-6">{plan.name}</h3>
                                <div className="mb-8">
                                    <span className="text-5xl font-black text-white">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className={`text-sm font-medium ml-1.5 ${plan.featured ? 'text-indigo-200' : 'text-slate-500'}`}>/month</span>}
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, fi) => (
                                        <li key={fi} className="flex items-center gap-2.5 text-sm">
                                            <CheckCircle2 size={15} className={plan.featured ? 'text-indigo-200' : 'text-indigo-400'} />
                                            <span className={plan.featured ? 'text-indigo-50' : 'text-slate-400'}>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={plan.href} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${plan.featured
                                    ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                                    : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                                    }`}>
                                    {plan.cta} <ArrowRight size={14} />
                                </Link>
                            </div>
                        ))}
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
                                <button className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white px-8 py-4 rounded-xl text-base font-semibold transition-all">
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
        </div>
    );
}
