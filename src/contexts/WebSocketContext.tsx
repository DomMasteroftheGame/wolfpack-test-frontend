import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { WebSocketMessage } from '../types';

// Use window variable from Shopify or env or fallback to PROD backend (not localhost)
const WS_BASE = (window.pwaThemeVariables?.apiUrl || import.meta.env.VITE_API_URL || 'https://buildyourwolfpack.onrender.com').replace(/^http/, 'ws');
const WS_URL = `${WS_BASE}/ws`;

interface WebSocketContextType {
  connected: boolean;
  messages: WebSocketMessage[];
  sendMessage: (message: any) => void;
  setCurrentProjectId: (projectId: string | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const { token, currentUser } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !currentUser) {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    if (socket) {
      socket.close();
    }

    let wsUrl = `${WS_URL}?user_id=${currentUser.id}`;
    if (currentProjectId) {
      wsUrl += `&project_id=${currentProjectId}`;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        setMessages((prev) => [...prev, message]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token, currentUser, currentProjectId]);

  const sendMessage = (message: any) => {
    if (socket && connected) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('Cannot send message: WebSocket not connected');
    }
  };

  const value = {
    connected,
    messages,
    sendMessage,
    setCurrentProjectId,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}
