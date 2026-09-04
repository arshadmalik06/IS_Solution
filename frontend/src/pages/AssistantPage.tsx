import { useRef, useEffect, useState } from 'react'
import { useChat } from '../hooks/useChat'
import Layout from '../components/Layout'
import ChatInput from '../components/ChatInput'
import UserMessage from '../components/chat/UserMessage'
import AssistantMessage from '../components/chat/AssistantMessage'
import EmptyState from '../components/chat/EmptyState'
import SplitScreen from '../components/chat/SplitScreen' 

export default function AssistantPage() {
  const { messages, isLoading, sessions, sendMessage, clearChat } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // This state tracks which PDF is currently open
  const [activePdf, setActivePdf] = useState<{ filename: string; page: number } | null>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const chatTitle = messages.length > 0
    ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
    : undefined

  return (
    <Layout sessions={sessions} onNewChat={clearChat} currentPage="assistant" chatTitle={chatTitle || 'QuBIS Assistant'}>
      <div className="flex h-full relative w-full overflow-hidden">
        
        {/* Left Side: Chat Interface */}
        <div className={`flex flex-col h-full transition-all duration-300 relative ${activePdf ? 'w-1/2' : 'w-full'}`}>
          <div className="flex-1 overflow-y-auto px-4 pb-36 sm:px-6 sm:pb-40 md:px-10 lg:px-12">
            <div className={`mx-auto w-full max-w-4xl ${messages.length === 0 ? 'min-h-full' : 'space-y-5 pt-6 md:pt-8'}`}>
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map(msg =>
                  msg.role === 'user' ? (
                    <UserMessage key={msg.id} message={msg} />
                  ) : (
                    <AssistantMessage 
                      key={msg.id} 
                      message={msg} 
                      onOpenPdf={(filename: string, page: number) => setActivePdf({ filename, page })} 
                    />
                  )
                )
              )}
              <div ref={scrollRef} />
            </div>
          </div>
          <ChatInput onSend={sendMessage} isLoading={isLoading} isInitialState={messages.length === 0} />
        </div>

        {/* Right Side: The PDF Viewer Component */}
        {activePdf && (
          <SplitScreen 
            filename={activePdf.filename} 
            page={activePdf.page} 
            onClose={() => setActivePdf(null)} 
          />
        )}
        
      </div>
    </Layout>
  )
}