import { useState, useCallback, useRef } from 'react'
import { streamChat } from '../api/chat'
import type { Message, Source, ChatSession } from '../types'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: '1', title: 'IS 16102 LED Bulb Scheme I', lastMessage: 'LED lamp compliance query', timestamp: new Date(), path: 'assistant' },
    { id: '2', title: 'HUID Jewellery Verification', lastMessage: 'Hallmarking verification', timestamp: new Date(), path: 'assistant' },
    { id: '3', title: 'Packaged Drinking Water Lab Search', lastMessage: 'Lab search query', timestamp: new Date(), path: 'labs' },
    { id: '4', title: 'Plywood IS 303 Requirements', lastMessage: 'Plywood standard', timestamp: new Date(), path: 'standards' },
    { id: '5', title: 'Cement ISI Conformance', lastMessage: 'Cement standards', timestamp: new Date(), path: 'assistant' },
    { id: '6', title: 'Toys Quality Control Order', lastMessage: 'Toys QCO', timestamp: new Date(), path: 'assistant' },
  ])
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

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

    await streamChat(text, 'default', {
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
                  content: `Connection error: ${err.message}. Please ensure the backend is running on port 8000.`,
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

        // Add to sessions
        const title = text.length > 40 ? text.slice(0, 40) + '...' : text
        setSessions(prev => [
          { id: Date.now().toString(), title, lastMessage: text, timestamp: new Date(), path: 'assistant' },
          ...prev,
        ])
      },
    })
  }, [isLoading])

  const clearChat = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setIsLoading(false)
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sessions,
    sendMessage,
    clearChat,
  }
}
