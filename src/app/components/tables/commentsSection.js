import React, { useState, useRef, useContext, useEffect } from 'react';
import {
    User,
    Image,
    FileText,
    Send,
    Paperclip,
    X,
    Loader2,
    UserPlus,
    Smile,
    AtSign,
} from 'lucide-react';
import CommentCard from '../cards/commentcard';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { LeadContext } from '@/app/contexts/leadontext';

const CommentsSection = ({ comments, addcomment }) => {
    const [newComment, setNewComment] = useState('');
    const [Comments, setComments] = useState(comments || []);
    const [attachment, setAttachment] = useState(null);
    const [loader, setloader] = useState(false);
    const [newfile, setFile] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);
    const [showMentions, setShowMentions] = useState(false);
    const [mentionQuery, setMentionQuery] = useState('');
    const fileInputRef = useRef(null);
    const { setLead, lead } = useContext(LeadContext);
    const router = useRouter();

    useEffect(() => {
        axios.get('/api/user/searchuser?q=')
            .then(res => setTeamMembers(res.data))
            .catch(err => console.error("Failed to fetch teammates"));
    }, []);

    const handleCommentChange = (e) => {
        const text = e.target.value;
        setNewComment(text);
        const lastAtPos = text.lastIndexOf('@');
        if (lastAtPos !== -1) {
            const query = text.substring(lastAtPos + 1).split(' ')[0];
            const afterAt = text.substring(lastAtPos);
            if (!afterAt.includes(' ')) {
                setMentionQuery(query);
                setShowMentions(true);
            } else {
                setShowMentions(false);
            }
        } else {
            setShowMentions(false);
        }
    };

    const insertMention = (name) => {
        const lastAtPos = newComment.lastIndexOf('@');
        const beforeAt = newComment.substring(0, lastAtPos);
        const afterMention = newComment.substring(lastAtPos + 1 + mentionQuery.length);
        setNewComment(`${beforeAt}@${name} ${afterMention}`);
        setShowMentions(false);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const newAttachment = {
                id: `${Date.now()}-${file.name}`,
                file,
                type: file.type.includes('pdf') ? 'pdf' : 'image',
                preview: file.type.includes('pdf') ? null : URL.createObjectURL(file)
            };
            setAttachment(newAttachment);
            setFile(file);
        }
    };

    const removeAttachment = () => {
        setAttachment(null);
        setFile(null);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        setloader(true);
        const newCommentObj = {
            id: `${router.query.id}`,
            text: newComment,
            timestamp: new Date(),
        };
        const formData = new FormData();
        if (newfile) formData.append('file', newfile);
        formData.append('comment', JSON.stringify(newCommentObj));

        try {
            let res = await axios.post('/api/leaddetails/addcomment', formData);
            if (res.status === 200) {
                setLead(res.data?.data);
                setNewComment('');
                setAttachment(null);
                setFile(null);
                setShowMentions(false);
                toast.success('Comment Shared');
            }
        } catch (e) {
            toast.error('Failed to post comment');
        }
        setloader(false);
    };

    useEffect(() => {
        setComments(comments || []);
    }, [lead, comments]);

    return (
        <div className="flex flex-col h-full bg-slate-50/30">
            {/* Feed Area */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6 min-h-[400px]">
                {Comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-40">
                        <div className="bg-gray-100 p-6 rounded-full">
                            <MessageSquare size={32} />
                        </div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">Start the conversation</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in duration-700">
                        {Comments.map((comment, idx) => (
                            <div key={comment.id || idx} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <CommentCard comment={comment} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                {loader ? (
                    <div className="flex items-center justify-center h-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        <span className="ml-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Uploading...</span>
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="absolute -top-20 left-0 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white p-2 rounded-xl shadow-xl border border-indigo-100 flex items-center gap-3 ring-4 ring-indigo-50/50">
                                    {attachment.type === 'image' ? (
                                        <img src={attachment.preview} className="w-12 h-12 object-cover rounded-lg" alt="" />
                                    ) : (
                                        <div className="w-12 h-12 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500"><FileText size={20} /></div>
                                    )}
                                    <div className="pr-2">
                                        <p className="text-[10px] font-bold text-gray-900 truncate max-w-[120px]">{attachment.file.name}</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{attachment.type}</p>
                                    </div>
                                    <button onClick={removeAttachment} className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-rose-100 hover:text-rose-600 transition-colors">
                                        <X size={12} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mentions Dropdown */}
                        {showMentions && teamMembers.length > 0 && (
                            <div className="absolute bottom-full mb-3 left-0 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                <div className="bg-indigo-50/50 px-4 py-2 border-b border-indigo-100">
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Mention Teammate</span>
                                </div>
                                <div className="max-h-56 overflow-y-auto">
                                    {teamMembers
                                        .filter(m => m.name.toLowerCase().includes(mentionQuery.toLowerCase()))
                                        .map((member) => (
                                            <button key={member.id} onClick={() => insertMention(member.name)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 text-left transition-colors group">
                                                <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">{member.name.charAt(0).toUpperCase()}</div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{member.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{member.email}</p>
                                                </div>
                                            </button>
                                        ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-slate-50 rounded-[1.25rem] border border-slate-200/60 focus-within:bg-white focus-within:border-indigo-400/50 focus-within:ring-4 focus-within:ring-indigo-50/50 transition-all duration-300">
                            <textarea
                                placeholder="Write a comment or type @ to mention..."
                                value={newComment}
                                onChange={handleCommentChange}
                                className="w-full p-4 bg-transparent outline-none resize-none h-28 text-sm font-medium text-slate-700 placeholder:text-slate-300"
                            />

                            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200/40">
                                <div className="flex items-center gap-2">
                                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,application/pdf" className="hidden" />
                                    <button onClick={() => fileInputRef.current?.click()} className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
                                        <Paperclip size={18} />
                                    </button>
                                    <button className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all max-sm:hidden">
                                        <Smile size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim() && !newfile}
                                    className="h-10 px-6 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all flex items-center gap-2 text-sm font-bold"
                                >
                                    <span>Post</span>
                                    <Send size={15} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
