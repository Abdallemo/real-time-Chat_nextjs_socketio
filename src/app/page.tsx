'use client'

import { FormEvent, Suspense, useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import { createUser } from '@/lib/action';

export default function Home() {
  // Initialize username from localStorage
  const [username, setUsername] = useState<string>(() => localStorage.getItem('username') || '');

  // Initialize hasJoined based on whether a username exists in localStorage
  const [hasJoined, setHasJoined] = useState<boolean>(() => !!localStorage.getItem('username'));

  const handleJoinChat = (e:FormEvent) => {
    e.preventDefault();
    createUser(username)

      localStorage.setItem("username", username);
      setHasJoined(true); 
    
    
  };

  return (
    <Suspense fallback={'loading...'}>
      {!hasJoined ? (
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4">Enter your username</h2>
            <form onSubmit={(e)=>handleJoinChat(e)}>
            <input
              type="text"
              className="border rounded px-4 py-2 w-full mb-4"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleJoinChat(e);
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              type='submit'
            >
              Join Chat
            </button>


            </form>
          </div>
        </div>
      ) : (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
          <ChatInterface username={username} />
        </main>
      )}
    </Suspense>
  );
}