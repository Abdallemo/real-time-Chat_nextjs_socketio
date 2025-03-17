"use client"
import 'dotenv/config';
import { useEffect, useRef, useState } from 'react';
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
    //const [socket, setSocket] = useState<Socket | null>(null); socket Ref is better 
    const socketRef = useRef<Socket|null>(null)

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [messages, setMessage] = useState<Message[]>([]);
    const [users, setUsers] = useState<string[]>([]);

   

    useEffect(() => {
      socketRef.current = io(`http://192.168.0.66:${PORT}`, {
        transports: ["websocket", "polling"],
        reconnection:true,
        reconnectionAttempts:5,
        reconnectionDelay:1000
      });
  
      const cleanupListeners = () => {
         socketRef.current?.off("connect");
         socketRef.current?.off("disconnect");
         socketRef.current?.off("chat message");
         socketRef.current?.off("all messages");
         socketRef.current?.off("update users");
         socketRef.current?.off("system message");
      };  
      cleanupListeners()

      //* eh New listner
      socketRef.current.on("connect", () => {
        console.log("Socket connected");
        setIsConnected(true);
        if(username){
          socketRef.current?.emit("user joined", username);

        }
      });
  
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });
  
      socketRef.current.on("chat message", (msg: Message) => {
        console.log("Chat message received:", msg);
        setMessage((prev) => [...prev, msg]);
      });
  
      socketRef.current.on("all messages", (allMessages: Message[]) => {
        console.log("Fetched messages:", allMessages);
        setMessage((prev) => [...allMessages, ...prev]);
      });
  
      socketRef.current.on("update users", (updatedUsers: string[]) => {
        console.log("Updated users (client):", updatedUsers);
        setUsers(updatedUsers);
      });

      socketRef.current.on('system message', (systemMessages: string) => {
        console.log(systemMessages);
        addSystemMessage(systemMessages);
      });
  
      
  
      
      return () => {
        socketRef.current?.disconnect();
        socketRef.current = null
        setMessage([])
      };
    }, [username,]);
  
    const sendMessage = (text: string, roomId?: string) => {
      if (socketRef.current) {
        const message: Message = {
          id: uuidv4(),
          user: username,
          text,
          timestamp: new Date(),
          roomId,
          system: false,
        };
        socketRef.current.emit("chat message", message);
      }
    };
    //TODO not used yet
    const joinRoom = (roomId: string) => {
      if (socketRef.current) {
        socketRef.current?.emit("join room", roomId);
      }
    };
    const addSystemMessage = (text: string, roomId?: string) => {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          id: uuidv4(),
          user: 'System',
          text,
          timestamp: new Date(),
          roomId,
          system: true,
        },
      ]);
    } ;
  
    return { isConnected, messages, sendMessage, users, joinRoom };
  };
  