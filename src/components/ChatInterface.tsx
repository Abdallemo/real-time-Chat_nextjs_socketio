import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSocket } from '@/hooks/useSocket';
import ChatMessage from './ChatMessage';
import OnlineUsers from './OnlineUsers';
import LoaderSpinner from './ladoingbars';

interface ChatInterfaceProps {
  username: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ username }) => {
  const { isConnected, messages, sendMessage, users } = useSocket(username);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
      <div className='bg-amber-100 w-[20]' ></div>
      <div className="flex-grow mr-4">
        <h1 className="text-2xl font-bold mb-4">WebSocket Chat Demo</h1>
        <div className={`mb-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="mb-4 h-64 overflow-y-auto border border-gray-300 rounded p-2">
          {messages.map((msg) => (
            <Suspense key={msg.id} fallback={<LoaderSpinner/>}>
              <ChatMessage key={msg.id} message={msg} isOwnMessage={msg.user === username} />
            </Suspense>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-grow mr-2 p-2 border border-gray-300 rounded"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!isConnected}
          >
            Send
          </button>
        </form>
      </div>
      <OnlineUsers users={users} currentUser={username} />
    </div>
  );
};
