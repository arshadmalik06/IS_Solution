import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, MessageSquare, Menu, Send, Search, ShieldCheck, Award, FlaskConical, Globe, Moon, X, FileText, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import logo from '../assets/logo.png'
import ChatBackground from '../components/chat/ChatBackground'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

type Source = {
  content: string
  metadata: {
    standard_id: string
    clause_id: string
    [key: string]: any
  }
}

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
}

const BACKEND_URL = 'http://127.0.0.1:8000'

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSource, setActiveSource] = useState<Source | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const assistantId = (Date.now() + 1).toString()
    
    setMessages(prev => [...prev, userMsg, { id: assistantId, role: 'assistant', content: '', isStreaming: true }])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text, session_id: 'default' })
      })

      if (!response.ok) throw new Error('Network response was not ok')
      if (!response.body) throw new Error('No readable stream')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                setMessages(prev => prev.map(msg => {
                  if (msg.id === assistantId) {
                    if (data.sources) {
                      return { ...msg, sources: data.sources }
                    } else if (data.token) {
                      return { ...msg, content: msg.content + data.token }
                    }
                  }
                  return msg
                }))
              } catch (e) {
                // Ignore parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId ? { ...msg, content: 'An error occurred while connecting to the backend. Please ensure the backend is running.', isStreaming: false } : msg
      ))
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantId ? { ...msg, isStreaming: false } : msg
      ))
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <div className={cn(
        "hidden md:flex flex-col w-[260px] bg-surface-elevated/50 border-r border-border transition-all duration-300",
        !isSidebarOpen && "-ml-[260px]"
      )}>
        <SidebarContent 
          onNewChat={() => setMessages([])} 
          onQuickAction={(q) => handleSend(q)} 
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-background/80 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-text-muted hover:text-white rounded-md hover:bg-surface-elevated transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img src={logo} alt="QuBIS" className="w-6 h-6 object-contain" />
            <span className="font-semibold text-[15px]"><span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span> AI ASSISTANT</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-muted hover:text-white rounded-md hover:bg-surface-elevated transition-colors">
              <Globe className="w-4 h-4" />
            </button>
            <button className="p-2 text-text-muted hover:text-white rounded-md hover:bg-surface-elevated transition-colors">
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Chat Scroll Area */}
        <ChatBackground />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
          <div className="max-w-[800px] mx-auto w-full flex flex-col gap-8 pb-20">
            {messages.length === 0 ? (
              <EmptyState onQuickAction={(q) => handleSend(q)} />
            ) : (
              messages.map(msg => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  onSourceClick={setActiveSource} 
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-background via-background to-transparent absolute bottom-0 left-0 right-0">
          <div className="max-w-[800px] mx-auto w-full relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(input)
                }
              }}
              placeholder="Ask anything about Indian Standards..."
              className="w-full bg-surface-elevated border border-border rounded-2xl py-4 pl-4 pr-12 focus:outline-none focus:border-bis-blue transition-colors resize-none max-h-[200px] text-[15px]"
              rows={1}
              style={{ minHeight: '56px' }}
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isLoading}
              className="absolute right-3 bottom-3 p-2 rounded-xl bg-bis-blue text-white disabled:opacity-50 disabled:bg-surface-elevated disabled:text-text-muted transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center text-[11px] text-text-muted mt-2">
            <span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span> can make mistakes. Check important info.
          </div>
        </div>
      </div>

      {/* Source Viewer Drawer */}
      {activeSource && (
        <SourceViewer source={activeSource} onClose={() => setActiveSource(null)} />
      )}
    </div>
  )
}

function SidebarContent({ onNewChat, onQuickAction }: { onNewChat: () => void, onQuickAction: (q: string) => void }) {
  return (
    <div className="flex flex-col h-full p-3 gap-6">
      <Link to="/" className="flex items-center gap-2 p-2">
        <img src={logo} alt="QuBIS Logo" className="w-8 h-8 object-contain" />
        <span className="font-bold text-[14px]"><span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span></span>
      </Link>
      
      <button 
        onClick={onNewChat}
        className="w-full h-10 flex items-center gap-2 px-3 rounded-xl border border-border hover:bg-surface-elevated transition-colors text-[14px] font-medium"
      >
        <Plus className="w-4 h-4" /> New Chat
      </button>

      <div className="flex flex-col gap-1">
        <div className="text-[11px] font-semibold text-text-muted px-3 py-2 uppercase tracking-wider">Recent Chats</div>
        {['LED lamps standard', 'ISI Mark certification', 'Hallmarking process'].map((item, i) => (
          <button key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-elevated transition-colors text-left text-[13px] text-text-secondary w-full truncate">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1 mt-auto pb-4">
        <div className="text-[11px] font-semibold text-text-muted px-3 py-2 uppercase tracking-wider">Explore</div>
        {[
          { icon: <Search className="w-3.5 h-3.5"/>, label: 'Standards' },
          { icon: <Award className="w-3.5 h-3.5"/>, label: 'Certification' },
          { icon: <ShieldCheck className="w-3.5 h-3.5"/>, label: 'Hallmarking' },
          { icon: <FlaskConical className="w-3.5 h-3.5"/>, label: 'Laboratories' },
        ].map((item) => (
          <button 
            key={item.label}
            onClick={() => onQuickAction(`Tell me about BIS ${item.label}`)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-elevated transition-colors text-left text-[13px] text-text-secondary w-full"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function EmptyState({ onQuickAction }: { onQuickAction: (q: string) => void }) {
  const actions = [
    { label: "Find Standard", query: "Find standards related to LED lamps." },
    { label: "Certification Process", query: "What is the process for CRS certification?" },
    { label: "Hallmarking Guide", query: "How does gold hallmarking work in India?" },
    { label: "Testing Labs", query: "How can I find a BIS recognized testing lab?" },
  ]
  return (
    <div className="flex flex-col items-center justify-center pt-16 md:pt-32 gap-6 text-center">
      <img src={logo} alt="QuBIS Logo" className="w-16 h-16 object-contain" />
      <h2 className="text-[28px] font-bold">How can I help you today?</h2>
      <p className="text-text-muted text-[15px] max-w-[400px]">Ask anything about Indian Standards, certification schemes, and BIS services.</p>
      
      <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-[500px]">
        {actions.map(a => (
          <button 
            key={a.label}
            onClick={() => onQuickAction(a.query)}
            className="p-3 text-left border border-border rounded-xl bg-surface-elevated/50 hover:bg-surface-elevated transition-colors text-[13px] text-text-secondary font-medium"
          >
            {a.label} &rarr;
          </button>
        ))}
      </div>
    </div>
  )
}

function ChatMessage({ message, onSourceClick }: { message: Message, onSourceClick: (s: Source) => void }) {
  const isAssistant = message.role === 'assistant'
  
  return (
    <div className="flex gap-4">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 overflow-hidden",
        isAssistant ? "" : "bg-surface-elevated border border-border text-text-muted"
      )}>
        {isAssistant ? <img src={logo} alt="QuBIS" className="w-full h-full object-contain" /> : <span className="text-xs">You</span>}
      </div>
      
      <div className="flex-1 space-y-4 pt-1">
        <div className="text-[15px] font-medium text-text-primary">
          {isAssistant ? <><span className="text-bis-blue">Qu</span><span className="text-bis-red">BIS</span></> : 'You'}
        </div>
        
        <div className="prose prose-invert max-w-none text-[15px] leading-relaxed prose-p:leading-relaxed prose-pre:bg-surface-elevated prose-pre:border prose-pre:border-border text-text-secondary">
          {message.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          ) : (
            <div className="flex gap-1 items-center h-6">
              <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse delay-150" />
            </div>
          )}
        </div>
        
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-2">
            {message.sources.map((s, i) => (
              <button 
                key={i}
                onClick={() => onSourceClick(s)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface-elevated hover:bg-border/50 hover:border-bis-blue/50 transition-all text-[12px] font-medium text-text-secondary group"
              >
                <FileText className="w-3.5 h-3.5 text-bis-blue" />
                {s.metadata.standard_id} &bull; Clause {s.metadata.clause_id}
                <ChevronRight className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SourceViewer({ source, onClose }: { source: Source, onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[400px] lg:w-[500px] bg-surface z-50 border-l border-border shadow-2xl flex flex-col transform transition-transform duration-300">
      <div className="h-14 border-b border-border flex items-center justify-between px-4">
        <div className="font-semibold flex items-center gap-2">
          <FileText className="w-4 h-4 text-bis-blue" />
          Source Viewer
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surface-elevated rounded-lg transition-colors text-text-muted hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        <div className="space-y-1">
          <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider">Standard</div>
          <div className="text-[18px] font-semibold">{source.metadata.standard_id || 'Unknown Standard'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider">Clause</div>
          <div className="text-[15px] text-text-secondary">{source.metadata.clause_id || 'Unknown Clause'}</div>
        </div>
        <div className="space-y-2">
          <div className="text-[12px] uppercase font-bold text-text-muted tracking-wider">Source Content</div>
          <div className="p-4 bg-surface-elevated border border-border rounded-xl text-[14px] leading-relaxed whitespace-pre-wrap font-mono text-text-secondary">
            {source.content}
          </div>
        </div>
      </div>
    </div>
  )
}
