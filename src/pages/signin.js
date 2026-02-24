import React, { useState, useEffect } from 'react';
import { Button } from "../components/components/ui/button";
import { Input } from "../components/components/ui/input";
import { Label } from "../components/components/ui/label";
import { EyeIcon, EyeOffIcon, Layers, Loader2, ShieldCheck, Mail, Lock, Plus } from "lucide-react";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loader, setLoader] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/isauthenticated');
                if (response.status === 200) {
                    router.push('/');
                }
            } catch (error) {
                // Not authenticated, stay on login
            }
        };
        checkAuth();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const response = await axios.post('/api/auth/login', { email, password });

            if (response.data.status === 200) {
                toast.success("Login successful!");
                router.push('/');
            } else {
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#F8FAFC]">
            {/* ── Left Section: Visual Brand ── */}
            <div className="hidden lg:flex flex-1 relative bg-[#0F1626] items-center justify-center overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-500 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 px-20 text-center">
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-[2rem] backdrop-blur-xl mb-10">
                        <div className="bg-indigo-600 p-4 rounded-2xl shadow-2xl shadow-indigo-500/30">
                            <Layers className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
                        Precision <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Intelligence</span><br />
                        At Your Fingertips
                    </h2>
                    <p className="text-slate-400 text-lg font-medium max-w-md mx-auto leading-relaxed">
                        Access your advanced lead management console and monitor real-time business performance.
                    </p>

                    {/* Badge */}
                    <div className="mt-16 flex items-center justify-center gap-8 opacity-50">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="text-white h-6 w-6" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Enterprise Secure</span>
                        </div>
                    </div>
                </div>

                {/* Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* ── Right Section: Authenticaion Form ── */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center gap-3 mb-12">
                        <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-100">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-black text-[#0F1626] tracking-tight">LEAD<span className="text-indigo-600">CONVERTER</span></h1>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-[#0F1626] tracking-tight">System Login</h1>
                        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest text-[10px]">Administrative Access Portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Email Address
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Mail size={16} />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@leadconverter.ai"
                                        className="h-12 pl-12 pr-4 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                                    Privacy Key
                                </Label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <Lock size={16} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="h-12 pl-12 pr-12 bg-slate-50/50 border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-500 focus:bg-white transition-all font-medium text-sm"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={loader}
                                className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-[0.15em] text-[11px] rounded-xl shadow-xl shadow-indigo-100 border border-white/10 transition-all transform hover:scale-[1.01] active:scale-[0.98] flex items-center justify-center gap-3"
                            >
                                {loader ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                ) : (
                                    <>Authenicate <Plus size={14} strokeWidth={3} /></>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-10 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">LeadConverter v2.4.0</span>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Server Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
