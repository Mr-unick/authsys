import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    CheckCircle2,
    ArrowRight,
    Zap,
    Shield,
    BarChart3,
    Users,
    Layers,
    Layout,
    Globe,
    Target,
    AlertCircle,
    Mail,
    Phone,
    PlayCircle
} from "lucide-react";

import { useRouter } from 'next/router';
import axios from 'axios';

export default function Home() {
    const router = useRouter();
    const [activeScreenshot, setActiveScreenshot] = React.useState("/dashboard.png");

    React.useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/isauthenticated');
                if (response.status === 200) {
                    router.push('/crm');
                }
            } catch (error) {
                // Not authenticated, stay on landing page
            }
        };
        checkAuth();
    }, [router]);
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-700">
            <Head>
                <title>Lead Converter | Next-Gen CRM for Modern Businesses</title>
                <meta name="description" content="Automate your lead lifecycle, manage multiple branches, and boost conversions with Lead Converter CRM." />
            </Head>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-xl">
                            <Layers className="text-white h-5 w-5" />
                        </div>
                        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-700 to-violet-800 bg-clip-text text-transparent">
                            LEAD CONVERTER
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
                        <a href="#problem" className="hover:text-indigo-600 transition-colors">The Problem</a>
                        <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#screenshots" className="hover:text-indigo-600 transition-colors">Interface</a>
                        <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/signin" className="text-sm font-bold text-slate-600 hover:text-indigo-600">Log In</Link>
                        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
                            Book Demo
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Grid & Glows */}
                <div className="absolute inset-0 z-[-1] opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-violet-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 text-xs font-black uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom duration-500">
                        <Zap className="h-4 w-4 fill-indigo-200" /> Version 2.0 is Live
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom duration-700 delay-100">
                        Stop Losing Leads. <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">Start Converting.</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-10 font-medium leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                        The unified CRM platform for multi-branch organizations. Automate sync, track every interaction, and empower your sales team with real-time intelligence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                        <button className="w-full sm:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                            Book Your Demo <ArrowRight className="h-5 w-5" />
                        </button>
                        <button className="w-full sm:w-auto bg-white border border-slate-200 px-8 py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                            <PlayCircle className="h-5 w-5 text-indigo-600" /> Watch Walkthrough
                        </button>
                    </div>

                    {/* Trusted By */}
                    <div className="mt-20 pt-10 border-t border-slate-100 animate-in fade-in duration-1000 delay-500">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Trusted by 500+ Enterprise Teams</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-40 grayscale contrast-125">
                            {['Google Ads', 'Meta Ads', 'Whatapp', 'Salesforce', 'Hubspot'].map(brand => (
                                <span key={brand} className="text-xl lg:text-3xl font-black tracking-tighter text-slate-400">{brand}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section id="problem" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-red-600 font-black text-xs uppercase tracking-widest mb-4 block">The Problem</span>
                            <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
                                Your current "system" is <br /> leaky and disconnected.
                            </h2>
                            <div className="space-y-6">
                                {[
                                    { title: "Manual Data Entry", desc: "Copy-pasting leads from Meta/Google is slow and prone to errors." },
                                    { title: "Lead Ghosting", desc: "Untracked leads fall through the cracks when follow-ups are missed." },
                                    { title: "Multi-Branch Chaos", desc: "No visibility into how individual branches or sales agents are performing." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                        <div className="mt-1 bg-red-50 p-2 rounded-lg text-red-600 h-fit">
                                            <AlertCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                                            <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-red-500 to-orange-600 rounded-[2rem] blur-2xl opacity-10 animate-pulse" />
                            <div className="relative bg-white p-8 rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden group">
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="h-3 w-1/3 bg-slate-100 rounded-full" />
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-red-400" />
                                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-red-50 rounded-2xl border border-red-100 relative overflow-hidden group-hover:shake">
                                            <div className="flex items-center gap-2 mb-2 text-red-600 font-black text-[10px]">
                                                <AlertCircle size={12} /> SYNC FAILED
                                            </div>
                                            <div className="h-2 w-full bg-red-200 rounded-full mb-2" />
                                            <div className="h-2 w-2/3 bg-red-100 rounded-full" />
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="h-2 w-1/2 bg-slate-200 rounded-full mb-2" />
                                            <div className="h-2 w-full bg-slate-100 rounded-full" />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-slate-900 rounded-[2rem] text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">Lost Opportunity</p>
                                        <p className="text-2xl font-black text-white leading-none">-$12,450</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-2 flex-1 bg-slate-100 rounded-full" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4 block">Platform Core</span>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">
                            Everything you need to scale your sales engine.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap />, title: "Live Sync", desc: "Deep integrations with Meta & Google Ads to fetch leads the second they hit submit.", color: "blue" },
                            { icon: <Layout />, title: "Branch Manager", desc: "Manage 1 branch or 1,000. Distinct views for branch admins and HQ.", color: "indigo" },
                            { icon: <BarChart3 />, title: "Deep Analytics", desc: "Leaderboards, conversion rates, and performance pulse. Data-driven growth.", color: "emerald" },
                            { icon: <Users />, title: "RBAC Controls", desc: "Granular permissions for sales staff, admins, and support teams.", color: "violet" },
                            { icon: <Target />, title: "Round Robin", desc: "Automatically distribute leads to the right salesperson fairly and instantly.", color: "amber" },
                            { icon: <Shield />, title: "Support Tickets", desc: "Built-in helpdesk for multi-tenant users to stay supported 24/7.", color: "rose" }
                        ].map((feat, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-50/50 transition-all duration-500">
                                <div className={`mb-6 p-3 rounded-2xl w-fit bg-${feat.color}-50 text-${feat.color}-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500`}>
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
                                <p className="text-slate-500 font-medium text-sm leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Premium Dashboard Preview */}
                    <div className="mt-32 relative group">
                        {/* High-Impact Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

                        <div className="relative rounded-[3rem] overflow-hidden border border-slate-100 shadow-[0_50px_100px_-30px_rgba(79,70,229,0.15)] bg-white p-3 rotate-1 hover:rotate-0 transition-all duration-1000">
                            <div className="rounded-[2.5rem] overflow-hidden border border-slate-50 relative">
                                <img
                                    src="/dashboard.png"
                                    alt="Platform Dashboard Preview"
                                    className="w-full h-auto transition-transform duration-1000 group-hover:scale-[1.01]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* Interactive floating card */}
                        <div className="absolute -bottom-12 -left-8 lg:-left-16 bg-white p-6 rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-indigo-50 hidden xl:flex items-center gap-5 translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                            <div className="p-4 bg-emerald-500 rounded-2xl text-white shadow-xl shadow-emerald-200">
                                <Zap size={24} strokeWidth={3} />
                            </div>
                            <div className="pr-6">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Intelligence</p>
                                <p className="text-xl font-black text-slate-900 leading-none">Automated Lead Logic</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interface Section (Screenshots) */}
            <section id="screenshots" className="py-24 bg-[#0F1626] text-white relative overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Product Experience</span>
                        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Designed for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Peak Performance</span></h2>
                        <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">A premium workspace that focuses on what matters: your conversion rate.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Interactive Features List */}
                        <div className="lg:col-span-4 space-y-4">
                            {[
                                { id: 'dash', title: "Executive Dashboard", desc: "Monitor enterprise-wide health with real-time stats and growth trends.", img: "/crm_dashboard_mockup_1773057173663.png" },
                                { id: 'lead', title: "Lead Lifecycle Manager", desc: "Visualize your entire pipeline with intuitive drag-and-drop lead boards.", img: "/lead_management_ui_1773057192835.png" },
                                { id: 'mobile', title: "Mobile Control Center", desc: "Full-featured responsive UI to manage your business from anywhere.", img: "/crm_mobile_view_1773057211240.png" }
                            ].map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveScreenshot(item.img)}
                                    className={`w-full text-left p-6 rounded-[1.5rem] border-2 transition-all duration-500 group relative overflow-hidden ${activeScreenshot === item.img ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/20'}`}
                                >
                                    {activeScreenshot === item.img && (
                                        <div className="absolute left-0 top-0 w-1 h-full bg-indigo-500" />
                                    )}
                                    <h4 className={`font-black text-lg mb-2 transition-colors ${activeScreenshot === item.img ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                                        {item.desc}
                                    </p>
                                </button>
                            ))}
                        </div>

                        {/* Image Showcase */}
                        <div className="lg:col-span-8">
                            <div className="relative group">
                                {/* Decorative elements */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                                <div className="relative rounded-[2rem] overflow-hidden border-8 border-slate-900 bg-slate-900 shadow-2xl transition-transform duration-700 hover:scale-[1.01]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1626] via-transparent to-transparent opacity-40 z-10" />
                                    <img
                                        key={activeScreenshot}
                                        src={activeScreenshot}
                                        alt="CRM Screenshot"
                                        className="w-full h-auto animate-in fade-in zoom-in-95 duration-500"
                                    />
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl shadow-indigo-500/20 z-20 hidden md:flex items-center gap-3 border border-slate-100 animate-bounce">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div className="pr-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                        <p className="text-sm font-black text-slate-900 leading-none">Live Sync Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-indigo-600 font-black text-xs uppercase tracking-widest mb-4 block">Pricing Plans</span>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-6">Built for every stage of growth.</h2>
                        <p className="text-slate-500 font-medium">Choose a plan that matches your business complexity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Starter */}
                        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col group hover:border-indigo-100 transition-all">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2 block">Small Teams</span>
                            <h3 className="text-2xl font-black mb-6 tracking-tight">Starter</h3>
                            <div className="mb-8">
                                <span className="text-5xl font-black">$29</span>
                                <span className="text-slate-400 font-bold ml-2">/month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    "Single Branch Management",
                                    "Unified Lead Dashboard",
                                    "Table & Board Views",
                                    "Lead Source Tracking",
                                    "Email Support"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <CheckCircle2 className="text-indigo-500 h-5 w-5" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-100 font-bold hover:bg-slate-900 hover:text-white transition-all">Start 14-Day Trial</button>
                        </div>

                        {/* Professional */}
                        <div className="p-10 rounded-[2.5rem] bg-indigo-600 border border-indigo-500 shadow-2xl shadow-indigo-200 text-white flex flex-col scale-105 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-400 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">Recommended</div>
                            <span className="font-bold text-indigo-200 uppercase tracking-widest text-[10px] mb-2 block">Growing Business</span>
                            <h3 className="text-2xl font-black mb-6 tracking-tight">Professional</h3>
                            <div className="mb-8">
                                <span className="text-5xl font-black">$79</span>
                                <span className="text-indigo-200 font-bold ml-2">/month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    "Up to 5 Business Branches",
                                    "Custom Lead Stages",
                                    "Meta & Google Ads Sync",
                                    "Integration Suite Access",
                                    "Automated Round-Robin",
                                    "Standard Ticket Support"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-indigo-50">
                                        <CheckCircle2 className="text-emerald-300 h-5 w-5 fill-emerald-300/10" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/signin" className="w-full py-4 rounded-2xl bg-white text-indigo-600 font-extrabold shadow-xl hover:bg-indigo-50 transition-all text-center">Start Growing Now</Link>
                        </div>

                        {/* Enterprise */}
                        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex flex-col group hover:border-slate-300 transition-all">
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-2 block">High Volume</span>
                            <h3 className="text-2xl font-black mb-6 tracking-tight">Enterprise</h3>
                            <div className="mb-8">
                                <span className="text-5xl font-black">Contact</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    "Unlimited Branch Network",
                                    "Area of Operation Control",
                                    "Real-time Activity Logs",
                                    "Sales Territory Mapping",
                                    "Priority VIP Support",
                                    "Dedicated Success Manager"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                                        <CheckCircle2 className="text-indigo-500 h-5 w-5" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">Talk to Sales</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight">
                                Ready to maximize your <br /> lead potential?
                            </h2>
                            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto font-medium">
                                Join 500+ businesses who have increased their efficiency by 40% using Lead Converter.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
                                    Book a Live Demo
                                </button>
                                <button className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white/20 transition-all">
                                    Compare Plans
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10 mt-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-indigo-600 p-2 rounded-lg">
                                    <Layers className="text-white h-4 w-4" />
                                </div>
                                <span className="text-lg font-black tracking-tight text-slate-900 underline decoration-indigo-500/30">
                                    LEAD CONVERTER
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                Next-generation lead management and CRM for multi-branch organizations. Scale your sales without the stress.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors shadow-sm"><Mail size={16} /></div>
                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors shadow-sm"><Phone size={16} /></div>
                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors shadow-sm"><Globe size={16} /></div>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6 underline decoration-indigo-500">Product</h5>
                            <ul className="space-y-4 text-sm font-bold text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Integrations</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Enterprise</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6 underline decoration-indigo-500">Company</h5>
                            <ul className="space-y-4 text-sm font-bold text-slate-500">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Support</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-black text-xs uppercase tracking-widest text-slate-900 mb-6 underline decoration-indigo-500">Newsletter</h5>
                            <p className="text-xs text-slate-400 font-medium mb-4">Get the latest sales tips delivered weekly.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Your email" className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-medium w-full outline-none focus:border-indigo-500 transition-colors" />
                                <button className="bg-indigo-600 p-2 rounded-xl text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-200 pt-10">
                        <p>© 2024 LEAD CONVERTER CRM. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8 mt-4 md:mt-0">
                            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
                            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
                            <a href="#" className="hover:text-indigo-600">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
