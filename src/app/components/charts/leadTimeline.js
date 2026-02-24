import React from 'react';
import { Clock, User, ArrowRight, CheckCircle2 } from 'lucide-react';

const LeadTimeline = ({ data }) => {
  // Sort data by date descending (newest first)
  const sortedData = [...(data || [])].sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="relative space-y-0">
        {/* Main Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-slate-100" />

        {sortedData.map((change, index) => (
          <div key={index} className="relative pl-12 pb-10 group last:pb-0">
            {/* Timeline Indicator Hub */}
            <div
              className="absolute left-0 top-1.5 h-8 w-8 rounded-xl bg-white border-2 flex items-center justify-center z-10 shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md"
              style={{ borderColor: change?.stage?.colour || '#cbd5e1' }}
            >
              <div
                className="h-2 w-2 rounded-full animate-pulse"
                style={{ backgroundColor: change?.stage?.colour || '#cbd5e1' }}
              />
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all duration-300 relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-white shadow-sm"
                    style={{ backgroundColor: change?.stage?.colour || '#64748b' }}
                  >
                    {change?.stage?.stage_name}
                  </div>
                  <div className="h-4 w-4 text-slate-300 flex items-center justify-center">
                    <ArrowRight size={12} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tight">
                    {new Date(change?.changedAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <User size={14} className="text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    <span className="font-bold text-indigo-600">{change?.changedBy?.name}</span>
                    <span className="text-slate-500"> updated the lead stage.</span>
                  </p>
                  {change?.reason && (
                    <div className="mt-2 bg-slate-50/50 rounded-lg p-2.5 border border-slate-100/50 italic text-xs text-slate-500 font-medium">
                      "{change.reason}"
                    </div>
                  )}
                </div>
                <div className="shrink-0 pt-1">
                  <CheckCircle2 size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {sortedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <History size={32} className="opacity-20" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest italic">No history records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadTimeline;
