'use client'

import { useState } from 'react';
import ChatInterface from './components/ChatInterface';
export default function Home() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinChat = () => {
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Enter your username</h2>
          <input
            type="text"
            className="border rounded px-4 py-2 w-full mb-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleJoinChat();
              }
            }}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleJoinChat}
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <ChatInterface username={username} />
    </main>
  );
}