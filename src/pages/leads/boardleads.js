import BoardLeads from "../../app/components/tables/boardLeads";
import { Zap } from "lucide-react";

export default function boardleads() {
    return (
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-4 mb-2">
                <div className="bg-[#0F1626] p-3 rounded-2xl shadow-lg shadow-gray-200">
                    <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1626] tracking-tight leading-tight">Leads Board</h1>
                    <p className="text-sm font-medium text-gray-400 mt-0.5 hidden sm:block">Visual pipeline for managing your sales process</p>
                </div>
            </div>

            <BoardLeads />
        </div>
    );
}