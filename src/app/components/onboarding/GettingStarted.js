import React, { useState, useEffect } from 'react';
import {
    CheckCircle2,
    Circle,
    ArrowRight,
    Home,
    Layers,
    Users,
    Settings,
    Zap,
    Target,
    ChevronRight,
    Sparkles,
    Layout
} from "lucide-react";
import Link from 'next/link';
import { Card, CardContent } from "../../../components/components/ui/card";

export const GettingStarted = ({ stats }) => {
    const [progress, setProgress] = useState(0);

    // Define the onboarding steps
    const steps = [
        {
            id: 'business',
            title: 'Complete Business Profile',
            description: 'Set up your fundamental business details for branding.',
            icon: <Home className="h-5 w-5" />,
            link: '/buisnessettings/buisness',
            completed: stats?.hasBusinessProfile ?? true,
            required: true
        },
        {
            id: 'branch',
            title: 'Create First Branch',
            description: 'Structure your operations by adding your primary branch.',
            icon: <Layout className="h-5 w-5" />,
            link: '/buisnessettings/branches',
            completed: stats?.branchCount > 0,
            required: true
        },
        {
            id: 'stages',
            title: 'Define Lead Stages',
            description: 'Customize your sales pipeline stages (e.g., Hot, Cold, Won).',
            icon: <Layers className="h-5 w-5" />,
            link: '/buisnessettings/leadstages',
            completed: stats?.stageCount > 0,
            required: true
        },
        {
            id: 'users',
            title: 'Invite Team Members',
            description: 'Add your sales team and assign roles to start collaborating.',
            icon: <Users className="h-5 w-5" />,
            link: '/user',
            completed: stats?.userCount > 1, // Assumes at least one more user than the admin
            required: false
        },
        {
            id: 'integrations',
            title: 'Connect Integrations',
            description: 'Link Facebook or Google to automate lead flow.',
            icon: <Zap className="h-5 w-5" />,
            link: '/integrations',
            completed: stats?.integrationCount > 0,
            required: false
        },
        {
            id: 'leads',
            title: 'Add Your First Lead',
            description: 'Create a lead manually to test your new pipeline.',
            icon: <Target className="h-5 w-5" />,
            link: '/leads',
            completed: stats?.leadCount > 0,
            required: true
        }
    ];

    useEffect(() => {
        const completedCount = steps.filter(s => s.completed).length;
        setProgress(Math.round((completedCount / steps.length) * 100));
    }, [stats]);

    if (progress === 100) return null; // Hide if fully completed

    return (
        <Card className="border border-gray-100 rounded-3xl overflow-hidden bg-white mb-8">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-700 p-6 sm:p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">
                                Onboarding Guide
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome to Lead Converter!</h2>
                        <p className="text-indigo-100 text-sm md:text-base max-w-xl opacity-90">
                            Let's get your workspace ready. Complete these essential steps to launch your lead management system.
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[180px] border border-white/10 text-center">
                        <div className="text-4xl font-black mb-1">{progress}%</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-200 mb-3">Overall Progress</div>
                        <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-gray-100">
                    {steps.map((step) => (
                        <Link
                            key={step.id}
                            href={step.link}
                            className={`group p-6 hover:bg-gray-50 transition-all duration-300 ${step.completed ? 'opacity-75' : 'opacity-100'}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2.5 rounded-xl transition-all duration-300 ${step.completed
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'
                                    }`}>
                                    {step.icon}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className={`font-bold text-sm ${step.completed ? 'text-gray-500 line-through decoration-2' : 'text-slate-900'}`}>
                                            {step.title}
                                        </h3>
                                        {step.completed ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500 fill-green-50" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-center">
                    <button className="text-[10px] font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-[0.2em] transition-colors">
                        Scroll to explore more features
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};
