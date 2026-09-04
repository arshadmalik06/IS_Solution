import { useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import Layout from '../components/Layout'
import ChatInput from '../components/ChatInput'
import UserMessage from '../components/chat/UserMessage'
import AssistantMessage from '../components/chat/AssistantMessage'
import EmptyState from '../components/chat/EmptyState'

export default function AssistantPage() {
  const { messages, isLoading, sessions, sendMessage, clearChat } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const chatTitle = messages.length > 0
    ? messages[0].content.slice(0, 50) + (messages[0].content.length > 50 ? '...' : '')
    : undefined

  return (
    <Layout
      sessions={sessions}
      onNewChat={clearChat}
      currentPage="assistant"
      chatTitle={chatTitle || 'QuBIS Assistant'}
    >
      <div className="flex flex-col h-full relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-36 sm:px-6 sm:pb-40 md:px-10 lg:px-12">
          <div className={`mx-auto w-full max-w-4xl ${messages.length === 0 ? 'min-h-full' : 'space-y-5 pt-6 md:pt-8'}`}>
            {messages.length === 0 ? (
              <EmptyState />
            ) : (
              messages.map(msg =>
                msg.role === 'user' ? (
                  <UserMessage key={msg.id} message={msg} />
                ) : (
                  <AssistantMessage key={msg.id} message={msg} />
                )
              )
            )}
            <div ref={scrollRef} />
          </div>
        </div>

        {/* Fixed Bottom Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} isInitialState={messages.length === 0} />
      </div>
    </Layout>
  )
}
