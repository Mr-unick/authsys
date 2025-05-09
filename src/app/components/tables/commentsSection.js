import React, { useState, useRef } from 'react';
import {
    User,
    Image,
    FileText,
    Send,
    Paperclip,
    X
} from 'lucide-react';
import CommentCard from '../cards/commentcard';
import { Comments } from '../../../../const';
import axios from 'axios';

const CommentsSection = ({comments ,addcomment}) => {

 
   
    const [newComment, setNewComment] = useState('');
    const [Comments, setComments] = useState(comments);
    const [username, setUsername] = useState('');
    const [attachment, setAttachment] = useState(null);
    const[newfile,setFile]=useState(null)
    const fileInputRef = useRef(null);

    // Handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const newAttachment = {
                id: `${Date.now()}-${file.name}`,
                file,
                type: file.type.includes('pdf') ? 'pdf' : 'image',
                preview: file.type.includes('pdf')
                    ? '/pdf-icon.png'
                    : URL.createObjectURL(file)
            };
            setAttachment(newAttachment);
            setFile(file)
        }
    };

    // Remove attachment
    const removeAttachment = () => {
        setAttachment(null);
    };

    // Add comment
    const handleAddComment =async () => {
        if (newComment.trim()) {

            const newCommentObj = {
                id: `comment-${Date.now()}`,
                text: newComment,
                timestamp: new Date(),
                attachment: attachment || undefined
            };

            const formData = new FormData();
            formData.append('file', newfile);

            try{
             let res =  await axios.post('/api/leaddetails/addcomment',formData);
             console.log(res.data)

            }catch(e){
                console.log(e)
            }


            setComments(prev => [newCommentObj, ...prev]);
            setNewComment('');
            setUsername('');
            setAttachment(null);
        }
    };

    // Format timestamp
 
    return (
        <div className="flex flex-col mb-16">
        
            <div className="flex-grow overflow-y-scroll max-sm:overflow-y-hidden p-4 max-sm:p-0 space-y-4 h-[35rem] max-sm:-h-[10rem]">
                {comments?.length == 0? 
                    <div className="text-center text-gray-500 py-10 lg:max-h-[35rem] max-sm:max-h-[5rem] bg-red-300">
                        <p>No comments yet</p>
                    </div>
                : 

                <div className="max-h-[30rem]  max-sm:max-h-[20rem] space-y-4 overflow-y-scroll ">
                    { comments?.map((comment) => {
                    return <CommentCard comment={comment} />
                    })}
                </div>
                   
                }
            </div>

            {/* Sticky Comment Input */}

            {/* addcomment &&  */}
            <div className="sticky bottom-20  p-4  max-sm:px-0 ">
                <div className="flex items-start space-x-2 border rounded-md p-2 bg-white">  
                    {/* Comment Input */}
                    <div className="flex-grow relative">
                        <textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 pr-10  outline-none resize-none h-20 focus:outline-none "
                        />

                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="absolute top-0 right-0 bg-gray-100 rounded-lg p-1 flex items-center">
                                {attachment.type === 'image' ? (
                                    <img
                                        src={attachment.preview}
                                        alt="Attachment preview"
                                        className="w-10 h-10 object-cover rounded-md mr-2"
                                    />
                                ) : (
                                    <FileText className="text-blue-500 mr-2" size={24} />
                                )}
                                <button
                                    onClick={removeAttachment}
                                    className="text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* File Upload Buttons */}

                    {
                       
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept="image/*,application/pdf"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                            >
                                <Paperclip size={20} className="text-gray-600" />
                            </button>

                            {/* Send Button */}
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                className="p-2 bg-blue-500 text-white rounded-lg 
                         disabled:bg-gray-300 hover:bg-blue-600 
                         transition flex items-center"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    }
                  
                </div>
            </div>
        </div>
    );
};

export default CommentsSection;