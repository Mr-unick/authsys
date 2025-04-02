import { formatDateTime } from "@/utils/utility";
import { User, FileText, Download } from 'lucide-react';

export default function CommentCard({ comment }) {

    console.log(comment,'from comment card')
    return (
        <div
            key={comment.id}
            className="bg-white border-gray-200 border-[1px]  rounded-md p-4 shadow-xs hover:shadow-sm transition-shadow duration-300 "
        >
            <div className="flex items-start space-x-4">
              <h1>Hello</h1>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 text-sm font-normal">{comment?.user}</h3>
                            <span className="text-xs text-gray-400">
                                {/* {formatDateTime(comment?.createdAt)}  */}
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-500 text-sm leading-relaxed ">
                        {comment?.comment}
                    </p>

                    {comment?.attachment && (
                        <div className="mt-2">
                            {comment.attachment.type === 'image' ? (
                                <div className="mt-2">
                                    <a href={comment.attachment.preview} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={comment.attachment.preview}
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