

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
                <Loader2 className="animate-spin text-indigo-600 h-6 w-6" />
                <p className="text-xs text-slate-400 font-medium">Loading business data...</p>
            </div>
        );
    }

    // If there are multiple businesses (e.g. for Super Admin accidentally reaching here), fallback to table
    if (!business && tableResponse?.rows?.length > 1) {
        return <DataTable url={'getBuisnessProps'} />;
    }

    if (!business) {
        return (
            <div className="p-10 text-center bg-white rounded-xl border border-dashed border-slate-200">
                <Info size={40} className="mx-auto text-slate-200 mb-4" />
                <h2 className="text-lg font-bold text-slate-600">No business profile found</h2>
                <p className="text-sm text-slate-400 mt-1">Initialize your business settings to see details here.</p>
            </div>
        );
    }

    const sections = [
        {
            title: "Corporate Identity",
            fields: [
                { label: "Entity Name", value: business.name, icon: <Building2 /> },
                { label: "Business Email", value: business.email, icon: <Mail /> },
                { label: "Primary Contact", value: business.contact_number, icon: <Phone /> },
                { label: "Website", value: business.website || 'Not configured', icon: <Globe />, isLink: true },
            ]
        },
        {
            title: "Compliance & Tax",
            fields: [
                { label: "GST Number", value: business.gst_number || 'N/A', icon: <FileText />, mono: true },
                { label: "PAN Number", value: business.pan_number || 'N/A', icon: <Briefcase />, mono: true },
                { label: "Address", value: `${business.business_address}, ${business.city}, ${business.state}`, icon: <MapPin />, full: true },
            ]
        },
        {
            title: "Owner Information",
            fields: [
                { label: "Registered Owner", value: business.owner_name, icon: <Sparkles /> },
                { label: "Owner Email", value: business.owner_email, icon: <Mail /> },
                { label: "Owner Phone", value: business.owner_contact, icon: <Phone /> },
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="h-11 w-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Enterprise</span>
                            <span className="text-slate-300 text-xs font-mono">#{business.id}</span>
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">{business.name}</h1>
                    </div>
                </div>

                {tableResponse?.update && (
                    <button
                        onClick={() => setEditOpen(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={14} /> Update Settings
                    </button>
                )}
            </div>

            {/* Content Sections */}
            <div className="space-y-10">
                {sections.map((section, idx) => (
                    <div key={idx} className="group">
                        <div className="flex items-center gap-3 mb-5">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{section.title}</h3>
                            <div className="h-px flex-1 bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5">
                            {section.fields.map((field, fIdx) => (
                                <div key={fIdx} className={`${field.full ? 'md:col-span-2 lg:col-span-4' : ''}`}>
                                    <label className="text-xs font-semibold text-slate-400 block mb-1">{field.label}</label>
                                    <div className="flex items-center gap-2.5">
                                        {field.icon && (
                                            <div className="text-slate-300">
                                                {React.cloneElement(field.icon, { size: 14 })}
                                            </div>
                                        )}
                                        <div className={`text-sm font-medium text-slate-700 ${field.mono ? 'font-mono' : ''}`}>
                                            {field.isLink && field.value !== 'Not configured' ? (
                                                <a href={field.value.startsWith('http') ? field.value : `https://${field.value}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                                    {field.value}
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

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
                <p className="text-xs font-medium">Last sync {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-600">Active</span>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <Modal
                    title="Edit Business Profile"
                    open={editOpen}
                    onOpenChange={setEditOpen}
                >
                    <div className="p-2">
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
