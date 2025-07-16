import { formatDateTime } from "@/utils/utility";
import { User, FileText, Download } from 'lucide-react';

export default function CommentCard({ comment }) {


    return (
        <div
            key={comment.id}
            className="bg-white border-blue-200 border-[1px]   p-3 shadow-xs hover:shadow-sm transition-shadow duration-300 rounded-br-xl rounded-tr-xl rounded-bl-xl "
        >
            <div className="flex items-start space-x-3">
             
                <div className="flex-grow">
                <p className="text-gray-500 text-sm leading-relaxed ">
                        {comment?.comment}
                    </p>

                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 text-xs font-normal">{comment?.user?.name}</h3>
                            <span className="text-xs text-gray-400">
                                {formatDateTime(comment?.created_at)} 
                            </span>
                        </div>
                    </div>

                   

                    {comment?.url && (
                        <div className="mt-2">
                            {comment.type === 'image' ? (
                                <div className="mt-2">
                                    <a href={comment?.url} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={comment?.url}
                                            alt="Attachment"
                                            className="w-full max-h-48 object-cover rounded-md hover:opacity-90 transition-opacity"
                                        />
                                    </a>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200 pr-4">
                                    <div >
                                            <a href={comment.attachment.file.url} className="flex items-center" target="_blank" rel="noopener noreferrer">
                                            <FileText className="mr-2 text-blue-500" size={20} />
                                            <span className="text-xs text-gray-600 truncate">
                                                {comment.attachment.file.name}
                                            </span>
                                            </a>
                                    </div>
                                        
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}