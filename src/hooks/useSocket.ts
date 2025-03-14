"use client"
import 'dotenv/config';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';


export interface Message {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
    roomId?: string;
    system:boolean
  }
  const PORT = process.env.NEXT_PUBLIC_SOCKET_IO_URL_PORT



  export const useSocket = (username: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messages, setMessage] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);
    
    useEffect(() => {
      const socketIo = io(`http://localhost:${PORT}`, {
        transports: ["websocket", "polling"],
      });
  
      socketIo.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        socketIo.emit("user joined", username);
      });
  
      socketIo.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });
  
      socketIo.on("chat message", (msg: Message) => {
        console.log("Chat message received:", msg);
        setMessage((prev) => [...prev, msg]);
      });
  
      socketIo.on("all messages", (allMessages: Message[]) => {
        console.log("Fetched messages:", allMessages);
        setMessage((prev) => [...allMessages, ...prev]);
      });
  
      socketIo.on("update users", (updatedUsers: string[]) => {
        console.log("Updated users (client):", updatedUsers);
        setUsers(updatedUsers);
      });
  
      setSocket(socketIo);
      return () => {
        socketIo.disconnect();
      };
    }, [username]);
  
    const sendMessage = (text: string, roomId?: string) => {
      if (socket) {
        const message: Message = {
          id: uuidv4(),
          user: username,
          text,
          timestamp: new Date(),
          roomId,
          system: false,
        };
        socket.emit("chat message", message);
      }
    };
  
    const joinRoom = (roomId: string) => {
      if (socket) {
        socket.emit("join room", roomId);
      }
    };
  
    return { isConnected, messages, sendMessage, users, joinRoom };
  };
  