import { formatDateTime } from "@/utils/utility";
import { User, FileText, Download, Clock } from 'lucide-react';

export default function CommentCard({ comment }) {
    return (
        <div
            key={comment.id}
            className="group bg-white border border-indigo-100/50 p-2.5 sm:p-3 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl relative overflow-hidden"
        >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-indigo-500 transition-all" />

            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mt-0.5">
                        <div className="h-6 w-6 shrink-0 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px]">
                            {comment?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-xs tracking-tight">{comment?.user?.name}</h3>
                            <div className="flex items-center gap-1 text-gray-400">
                                <Clock size={8} />
                                <span className="text-[9px] font-bold uppercase tracking-tighter">
                                    {formatDateTime(comment?.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pl-8">
                    <p className="text-gray-700 text-[11px] leading-snug font-medium">
                        {comment?.comment}
                    </p>

                    {comment?.url && (
                        <div className="mt-2.5 animate-in fade-in zoom-in-95 duration-300">
                            {comment.type === 'image' ? (
                                <div className="relative group/img overflow-hidden rounded-lg border border-gray-100 shadow-sm">
                                    <a href={comment?.url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={comment?.url}
                                            alt="Attachment"
                                            className="w-full max-h-40 object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded w-auto text-[10px] font-bold text-gray-900">View Full Image</span>
                                        </div>
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50 group/file hover:bg-indigo-50 transition-colors">
                                    <div className="flex items-center min-w-0">
                                        <div className="h-8 w-8 rounded-md bg-white shadow-sm flex items-center justify-center mr-2.5 shrink-0">
                                            <FileText className="text-indigo-500" size={16} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-gray-900 truncate pr-4">
                                                {comment?.attachment?.file?.name || 'Attached Document'}
                                            </p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">PDF Document</p>
                                        </div>
                                    </div>
                                    <a href={comment?.url} target="_blank" rel="noopener noreferrer" className="h-6 w-6 rounded-md bg-white shadow-sm flex items-center justify-center text-indigo-600 hover:text-indigo-700 transition-colors">
                                        <Download size={12} />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
