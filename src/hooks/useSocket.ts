"use client"
import 'dotenv/config';
import { useCallback, useEffect, useState } from 'react';
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
    const [socket,setSocket] = useState<Socket | null>(null)
    const [isConnected,setIsConnected] = useState<boolean>(false)
    const [messages,setMessage] = useState<Message[]>([])
    const [users, setUsers] = useState<string[]>([]);
    
    const addSystemMessage = useCallback((text: string, roomId?: string) => {
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
      }, []);

      
    useEffect(()=>{
        const socketIo = io(`http://localhost:${PORT}`,{
            transports:["websocket", "polling"]
        });
        console.log(`PORT ${PORT}`)

        socketIo.on('connect',()=>{
            setIsConnected(true);
            socketIo.emit('user joined', username);

        })
        socketIo.on('disconnect',()=>{
            setIsConnected(false);
    
        })

        socketIo.on('chat message',(msg:Message)=>{
            console.log(msg)
            setMessage((prev)=>[...prev,msg]);

        });
        socketIo.on("all messages", (allMessages: Message[]) => {
          console.log("Fetched messages:", allMessages);
          setMessage((prev)=>[...allMessages,...prev]);
      });
  

        socketIo.on('update users', (updatedUsers: string[]) => {
            setUsers(updatedUsers);
        });
        socketIo.on('user joined', (joinedUsername: string) => {
            addSystemMessage(`${joinedUsername} has joined the chat.`);
          });
        socketIo.on('user left', (leftUsername: string) => {
            addSystemMessage(`${leftUsername} has left the chat.`);
          });


        setSocket(socketIo);
        return ()=>{
            socketIo.disconnect();
        }
    },[username,addSystemMessage]);

    const sendMessage = (text: string, roomId?: string) => {
        if (socket) {
          const message: Message = {
            id: uuidv4(),
            user: username,
            text,
            timestamp: new Date(),
            roomId,
            system:false
          };
          socket.emit('chat message', message);
        }
      };



      return { isConnected, messages, sendMessage ,users};
}