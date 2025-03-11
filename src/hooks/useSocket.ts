"use client"
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
        const socketIo = io("http://localhost:5000",{
            transports:["websocket", "polling"]
        });

        socketIo.on('connect',()=>{
            setIsConnected(true);
            socketIo.emit('user joined', username);

        })
        socketIo.on('disconnect',()=>{
            setIsConnected(false);
    
        })

        socketIo.on('chat message',(msg:Message)=>{
            setMessage((prev)=>[...prev,msg]);
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