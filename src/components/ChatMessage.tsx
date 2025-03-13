import { Message } from '@/hooks/useSocket';
import React from 'react';

interface ChatMessageProps {
    message: Message;
    isOwnMessage: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => (
    <>

       {!message.system  ?  <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>

                <strong>{message.user}: </strong>{message.text}
            </span>
            <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
            </div>
        </div> : <div className='mb-2 text-center '>
            {/* <p className='text-gray-600'>{message.user}</p> */}
            <span className='text-gray-600'>{message.text}</span>
            
            </div>}
    </>
);

export default ChatMessage;