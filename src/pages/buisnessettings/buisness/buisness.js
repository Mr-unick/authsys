

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from "../../../app/components/tables/dataTable";
import {
    Building2, Globe, Mail, Phone, MapPin, Edit3,
    ShieldCheck, Calendar, Info, Loader2, Sparkles,
    Briefcase, FileText, ChevronRight
} from 'lucide-react';
import Modal from "../../../app/components/modal";
import FormComponent from "../../../app/components/forms/form";
import { toast } from 'react-toastify';

export default function BuisnessDetails() {
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [tableResponse, setTableResponse] = useState(null);

    const fetchBusinessData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/getBuisnessProps');
            setTableResponse(res.data.data);
            const data = res.data.data.rows;
            if (data && data.length > 0) {
                // If it's a single business (Business Admin view)
                setBusiness(data.length === 1 ? data[0] : null);
            }
        } catch (err) {
            toast.error("Failed to load business details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinessData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Enterprise Data</p>
            </div>
        );
    }

    // If there are multiple businesses (e.g. for Super Admin accidentally reaching here), fallback to table
    if (!business && tableResponse?.rows?.length > 1) {
        return <DataTable url={'getBuisnessProps'} />;
    }

    if (!business) {
        return (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <Info size={48} className="mx-auto text-gray-200 mb-4" />
                <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">No business profile found</h2>
                <p className="text-gray-400 mt-2">Initialize your business settings to see details here.</p>
            </div>
        );
    }

    const sections = [
        {
            title: "Corporate Identity",
            icon: <Building2 size={14} className="text-indigo-500" />,
            fields: [
                { label: "Entity Name", value: business.name, icon: <Building2 className="text-indigo-400" /> },
                { label: "Business Email", value: business.email, icon: <Mail className="text-indigo-400" /> },
                { label: "Primary Contact", value: business.contact_number, icon: <Phone className="text-indigo-400" /> },
                { label: "Website", value: business.website || 'Not configured', icon: <Globe className="text-indigo-400" />, isLink: true },
            ]
        },
        {
            title: "Compliance & Tax",
            icon: <ShieldCheck size={14} className="text-emerald-500" />,
            fields: [
                { label: "GST Number", value: business.gst_number || 'N/A', icon: <FileText className="text-emerald-400" />, mono: true },
                { label: "PAN Number", value: business.pan_number || 'N/A', icon: <Briefcase className="text-emerald-400" />, mono: true },
                { label: "Address", value: `${business.business_address}, ${business.city}, ${business.state}`, icon: <MapPin className="text-emerald-400" />, full: true },
            ]
        },
        {
            title: "Owner Information",
            icon: <Sparkles size={14} className="text-amber-500" />,
            fields: [
                { label: "Registered Owner", value: business.owner_name, icon: <Sparkles className="text-amber-400" /> },
                { label: "Owner Email", value: business.owner_email, icon: <Mail className="text-amber-400" /> },
                { label: "Owner Phone", value: business.owner_contact, icon: <Phone className="text-amber-400" /> },
            ]
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Card */}
            <div className="bg-[#0F1626] rounded-[2.5rem] p-8 md:p-12 mb-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -ml-24 -mb-24"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 md:h-24 md:w-24 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 flex items-center justify-center text-white shadow-inner group transition-all duration-500 hover:scale-105">
                            <Building2 size={40} className="group-hover:rotate-6 transition-transform" />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full text-white shadow-lg shadow-indigo-500/40">Registered Tenant</span>
                                <span className="text-white/40 text-[10px] font-mono">#ID {business.id}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{business.name}</h1>
                            <p className="text-white/60 text-sm mt-3 flex items-center gap-2 font-medium">
                                <Sparkles size={14} className="text-indigo-400" />
                                {business.business_description || "Enterprise Profile & Operational Hub"}
                            </p>
                        </div>
                    </div>

                    {tableResponse?.update && (
                        <button
                            onClick={() => setEditOpen(true)}
                            className="bg-white text-[#0F1626] px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 self-start md:self-center"
                        >
                            <Edit3 size={16} /> Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {sections.map((section, idx) => (
                    <div key={idx} className={`bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50 flex flex-col hover:border-indigo-100 transition-colors ${section.fields.some(f => f.full) ? 'lg:col-span-2' : ''}`}>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-gray-50 rounded-xl">
                                {section.icon}
                            </div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{section.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {section.fields.map((field, fIdx) => (
                                <div key={fIdx} className={`space-y-2 group ${field.full ? 'md:col-span-2 lg:col-span-3' : ''}`}>
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">
                                        <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                                        {field.label}
                                    </div>
                                    <div className="bg-gray-50/50 rounded-2xl p-4 flex items-center gap-4 border border-transparent group-hover:border-indigo-50 transition-all">
                                        <div className="text-gray-400 group-hover:text-indigo-500 transition-colors">
                                            {field.icon && typeof field.icon !== 'string' ? React.cloneElement(field.icon, { size: 16 }) : field.icon}
                                        </div>
                                        <div className={`text-sm font-bold text-[#0F1626] ${field.mono ? 'font-mono tracking-tighter' : ''}`}>
                                            {field.isLink && field.value !== 'Not configured' ? (
                                                <a href={field.value.startsWith('http') ? field.value : `https://${field.value}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                                                    {field.value} <ChevronRight size={12} />
                                                </a>
                                            ) : field.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / Stats Note */}
            <div className="mt-8 bg-indigo-50/50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-100/50">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Last Infrastructure Sync</p>
                        <p className="text-xs font-bold text-indigo-900">{new Date().toLocaleString()}</p>
                    </div>
                </div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] text-center md:text-right">
                    Enterprise Portal v4.2.0 <br />
                    <span className="text-emerald-500">Security Core Active</span>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <Modal
                    title="Edit Business Profile"
                    open={editOpen}
                    onOpenChange={setEditOpen}
                >
                    <div className="max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide">
                        <FormComponent
                            id={business.id}
                            formdata={tableResponse?.updateform}
                            onSuccess={() => {
                                setEditOpen(false);
                                fetchBusinessData();
                                toast.success("Business profile updated successfully");
                            }}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}
