import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from "../../../app/components/tables/dataTable";
import {
    Building2, Mail, Phone, MapPin, Edit3,
    ShieldCheck, Calendar, Info, Loader2, Sparkles,
    Briefcase, FileText, ChevronRight
} from 'lucide-react';
import Modal from "../../../app/components/modal";
import FormComponent from "../../../app/components/forms/form";
import { toast } from 'react-toastify';

export default function BranchDetails() {
    const [branch, setBranch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [tableResponse, setTableResponse] = useState(null);

    const fetchBranchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/getBranchDetailsProps');
            setTableResponse(res.data.data);
            const data = res.data.data.rows;
            if (data && data.length > 0) {
                setBranch(data[0]);
            }
        } catch (err) {
            toast.error("Failed to load branch details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Branch Data</p>
            </div>
        );
    }

    if (!branch) {
        return (
            <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <Info size={48} className="mx-auto text-gray-200 mb-4" />
                <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">No branch profile found</h2>
                <p className="text-gray-400 mt-2">Associate your account with a branch to see details here.</p>
            </div>
        );
    }

    const sections = [
        {
            title: "Local Identity",
            fields: [
                { label: "Branch Name", value: branch.name, icon: <Building2 /> },
                { label: "Branch Code", value: branch.branch_code || 'N/A', icon: <FileText />, mono: true },
                { label: "Branch Email", value: branch.email || 'N/A', icon: <Mail /> },
                { label: "Contact Number", value: branch.number || 'N/A', icon: <Phone /> },
            ]
        },
        {
            title: "Operational Address",
            fields: [
                { label: "City", value: branch.city || 'N/A', icon: <MapPin /> },
                { label: "District", value: branch.district || 'N/A', icon: <MapPin /> },
                { label: "State", value: branch.state || 'N/A', icon: <MapPin /> },
                { label: "Pincode", value: branch.pincode || 'N/A', icon: <MapPin />, mono: true },
                { label: "Full Address", value: branch.address || 'N/A', icon: <MapPin />, full: true },
            ]
        },
        {
            title: "Branch Manager",
            fields: [
                { label: "Manager Name", value: branch.manager_name, icon: <Sparkles /> },
                { label: "Manager Email", value: branch.manager_email, icon: <Mail /> },
            ]
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-6 py-10 animate-in fade-in duration-500">
            {/* Minimal Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50/50 px-2 py-0.5 rounded">Active Branch</span>
                            <span className="text-gray-300 text-[10px] font-mono">#BR-{branch.id}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{branch.name}</h1>
                    </div>
                </div>

                {tableResponse?.update && (
                    <button
                        onClick={() => setEditOpen(true)}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                        <Edit3 size={14} /> Update Details
                    </button>
                )}
            </div>

            {/* Content Sections */}
            <div className="space-y-12">
                {sections.map((section, idx) => (
                    <div key={idx} className="group">
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">{section.title}</h3>
                            <div className="h-[1px] flex-1 bg-gray-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                            {section.fields.map((field, fIdx) => (
                                <div key={fIdx} className={`${field.full ? 'md:col-span-2 lg:col-span-4' : ''}`}>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">{field.label}</label>
                                    <div className="flex items-center gap-3">
                                        {field.icon && (
                                            <div className="text-gray-300 group-hover:text-emerald-500 transition-colors">
                                                {React.cloneElement(field.icon, { size: 14 })}
                                            </div>
                                        )}
                                        <div className={`text-sm font-semibold text-gray-700 ${field.mono ? 'font-mono' : ''}`}>
                                            {field.value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-20 pt-8 border-t border-gray-100 flex items-center justify-between text-gray-400">
                <p className="text-[10px] font-medium">Branch Portal v4.2.0 • Last sync {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Secure Node</span>
                </div>
            </div>

            {/* Edit Modal */}
            {editOpen && (
                <Modal
                    title="Edit Branch Details"
                    open={editOpen}
                    onOpenChange={setEditOpen}
                >
                    <div className="p-2">
                        <FormComponent
                            id={branch.id}
                            formdata={tableResponse?.updateform}
                            onSuccess={() => {
                                setEditOpen(false);
                                fetchBranchData();
                                toast.success("Branch details updated successfully");
                            }}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
}
