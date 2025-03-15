"use client"

import { useState, useRef, useEffect, Suspense, FormEvent } from "react"
import ChatMessage from "@/components/chat-message"
import OnlineUsers from "@/components/OnlineUsers"
import { LoaderSpinner } from "@/components/ladoingbars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { singOutAction } from "@/lib/action"
import Header from "@/components/nav-bar"

export default function ChatApp({ username }: { username: string }) {
  const { isConnected, messages, sendMessage, users } = useSocket(username);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === "") return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await singOutAction();
    setIsSigningOut(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="h-screen w-screen flex flex-col">
      <Header handleSignOut={handleSignOut} username={username} isConnected={isConnected} isSigningOut={isSigningOut} onlineUsers={users.length} />

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col ">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {messages.map((msg) => (
                <Suspense key={msg.id} fallback={<LoaderSpinner />}>
                  <ChatMessage message={msg} isOwnMessage={msg.user === username} />
                </Suspense>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white sticky bottom-0">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1"
                placeholder="Type a message..."
                disabled={!isConnected}
              />
              <Button type="submit" size="icon" disabled={!isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* Online Users Sidebar */}
        <div className="w-64 border-l bg-card hidden md:block overflow-y-auto">
          <OnlineUsers users={users} currentUser={username} />
        </div>
      </div>
    </main>
  );
}