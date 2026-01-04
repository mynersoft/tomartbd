'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const { data: session } = useSession();

const id = "6953db3cb3b7f3c22ae8e8d2";
  useEffect(() => {
    // Only initialize socket on client side
    if (typeof window === 'undefined') return;

    // Initialize Socket.IO client
    const socketInstance = io({
      path: '/api/socketio',
      addTrailingSlash: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);

      // Send user ID if logged in
      if (id) {
        socketInstance.emit('register-user',id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, []);

  // Update socket with user session when available
  useEffect(() => {
    if (socketRef.current && id && isConnected) {
      socketRef.current.emit('register-user',id);
    }
  }, [session, isConnected]);

  const value = {
    socket: socketRef.current,
    isConnected,
    sendMessage: (roomId, message, senderId) => {
      if (!socketRef.current || !isConnected) return;

      socketRef.current.emit('send-message', {
        roomId,
        message,
        senderId,
        timestamp: new Date(),
      });
    },
    joinRoom: (roomId, userId) => {
      if (!socketRef.current || !isConnected) return;
      socketRef.current.emit('join-room', roomId, userId);
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
