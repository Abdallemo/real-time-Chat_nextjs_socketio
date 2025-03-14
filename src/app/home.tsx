"use client"

import { useState, useRef, useEffect, Suspense, FormEvent } from "react"
import ChatMessage from "@/components/chat-message"
import OnlineUsers from "@/components/OnlineUsers"
import { LoaderSpinner } from "@/components/ladoingbars"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {  Send } from "lucide-react"
import { useSocket } from "@/hooks/useSocket"
import { singOutAction } from "@/lib/action"


export default function ChatApp({username}:{username:string}) {

  const { isConnected, messages, sendMessage, users } = useSocket(username);

console.log('from home.tsx users',users)
  const [inputMessage, setInputMessage] = useState("")
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() === "") return
    sendMessage(inputMessage);
    setInputMessage('')
  
  }

  useEffect(() => {
    
    messagesEndRef.current?.scrollIntoView!({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      
      <header className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">WebSocket Chat Demo</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${isConnected ? "text-green-300" : "text-red-300"}`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
              {isConnected ? "Connected" : "Disconnected"}
            </div>
            <div className="font-medium">Logged in as: {username}</div>
          </div>
          
            <Button variant={"secondary"} className="ml-10" onClick={singOutAction}>
            SignOut
            </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {messages.map((msg) => (
                <Suspense key={msg.user} fallback={<LoaderSpinner />}>
                  <ChatMessage message={msg} isOwnMessage={msg.user === username} />
                </Suspense>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t">
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
        <div className="w-64 border-l bg-card hidden md:block">
          <OnlineUsers users={users} currentUser={username} />
        </div>
      </div>
    </div>
  )
}

