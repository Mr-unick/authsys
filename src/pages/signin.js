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
                const response = await axios.get('/api/auth/isauthenticated', {
                    validateStatus: (status) => (status >= 200 && status < 300) || status === 401
                });
                if (response.status === 200) {
                    router.push('/crm');
                }
            } catch (error) {
                // Ignore 401, they just need to sign in
                if (error.response?.status !== 401) {
                    console.error("Auth check failed:", error);
                }
            }
        };
        checkAuth();
    }, [router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoader(true);
            const response = await axios.post('/api/auth/login', { email, password }, {
                validateStatus: (status) => status >= 200 && status < 500
            });

            if (response.data.status === 200) {
                toast.success("Login successful!");
                router.push('/crm');
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
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-xl mb-10">
                        <div className="bg-indigo-600 p-4 rounded-xl">
                            <Layers className="h-10 w-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-6 leading-tight">
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
                            <span className="text-xs font-medium text-white/80">Enterprise Secure</span>
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
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <Layers className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-[#0F1626] tracking-tight">LEAD<span className="text-indigo-600">CONVERTER</span></h1>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-xl font-bold text-slate-800">System Login</h1>
                        <p className="text-xs text-slate-400 mt-0.5">Sign in to access your workspace</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-semibold text-slate-600">
                                    Your Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Ex. james@bond.com"
                                    className="h-10 px-3.5 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-sm placeholder:text-slate-400"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-600">
                                    Your Password
                                </Label>
                                <div className="relative group">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="h-10 px-3.5 pr-12 bg-white border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-colors text-sm placeholder:text-slate-400"
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

                        <div className="pt-1">
                            <Button
                                type="submit"
                                disabled={loader}
                                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loader ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                                ) : (
                                    <>Sign In</>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-10 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-400">LeadConverter v2.4.0</span>
                            <div className="flex gap-3 items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span className="text-xs font-medium text-slate-500">Server Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
