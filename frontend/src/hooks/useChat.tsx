import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { streamChat } from '../api/chat'
import type { Message, Source, ChatSession } from '../types'

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sessions: ChatSession[];
  activeSessionId: string | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  clearHistory: () => void;
  exportData: () => void;
  loadSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize sessions from LocalStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('qubis_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((s: any) => ({ ...s, timestamp: new Date(s.timestamp) }));
    }
    return [];
  });

  // 2. NEW: Router-proof active session tracking
  const [activeSessionId, setActiveSessionId] = useState<string | null>(() => {
    return localStorage.getItem('qubis_active_session') || null;
  });

  // 3. NEW: Router-proof message initialization
  const [messages, setMessages] = useState<Message[]>(() => {
    const activeId = localStorage.getItem('qubis_active_session');
    if (activeId) {
      const savedMessages = localStorage.getItem(`qubis_messages_${activeId}`);
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // 4. NEW: Keep active session ID synced with LocalStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('qubis_active_session', activeSessionId);
    } else {
      localStorage.removeItem('qubis_active_session');
    }
  }, [activeSessionId]);

  useEffect(() => {
    localStorage.setItem('qubis_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      localStorage.setItem(`qubis_messages_${activeSessionId}`, JSON.stringify(messages));
    }
  }, [messages, activeSessionId]);

  const loadSession = useCallback((sessionId: string) => {
    // Save to LocalStorage immediately before the router has a chance to reload
    setActiveSessionId(sessionId);
    localStorage.setItem('qubis_active_session', sessionId);

    const savedMessages = localStorage.getItem(`qubis_messages_${sessionId}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })));
    } else {
      setMessages([]);
    }
    setError(null);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    let currentSessionId = activeSessionId;

    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      setActiveSessionId(currentSessionId);
      const title = text.length > 40 ? text.slice(0, 40) + '...' : text;
      
      setSessions(prev => [
        { id: currentSessionId!, title, lastMessage: text, timestamp: new Date(), path: 'assistant' },
        ...prev,
      ]);
    } else {
      setSessions(prev => prev.map(s => 
        s.id === currentSessionId ? { ...s, lastMessage: text, timestamp: new Date() } : s
      ));
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    const assistantId = (Date.now() + 1).toString()
    const assistantMsg: Message = {
      id: assistantId,
      role: 'assistant',
      content: '',
      isStreaming: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg, assistantMsg])
    setIsLoading(true)
    setError(null)

    await streamChat(text, currentSessionId, {
      onSources: (sources: Source[]) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId ? { ...msg, sources } : msg
          )
        )
      },
      onToken: (token: string) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? { ...msg, content: msg.content + token }
              : msg
          )
        )
      },
      onError: (err: Error) => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId
              ? {
                  ...msg,
                  content: `Connection error: ${err.message}. Please ensure the backend is running.`,
                  isStreaming: false,
                }
              : msg
          )
        )
        setError(err.message)
        setIsLoading(false)
      },
      onComplete: () => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantId ? { ...msg, isStreaming: false } : msg
          )
        )
        setIsLoading(false)
      },
    })
  }, [isLoading, activeSessionId])

  const clearChat = useCallback(() => {
    abortRef.current?.abort()
    setActiveSessionId(null)
    localStorage.removeItem('qubis_active_session') // Ensure it clears on new chat
    setMessages([])
    setIsLoading(false)
    setError(null)
  }, [])

  const clearHistory = useCallback(() => {
    sessions.forEach(s => localStorage.removeItem(`qubis_messages_${s.id}`));
    localStorage.removeItem('qubis_sessions');
    localStorage.removeItem('qubis_active_session');
    setSessions([]);
    clearChat();
  }, [clearChat, sessions]);

  const exportData = useCallback(() => {
    const data = {
      messages,
      sessions
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qubis_export_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, sessions]);

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      error,
      sessions,
      activeSessionId,
      sendMessage,
      clearChat,
      clearHistory,
      exportData,
      loadSession,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}