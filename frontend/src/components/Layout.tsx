import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { ChatSession } from '../types'

type LayoutProps = {
  children: React.ReactNode
  sessions: ChatSession[]
  onNewChat: () => void
  currentPage: string
  chatTitle?: string
}

export default function Layout({ children, sessions, onNewChat, currentPage, chatTitle }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary transition-colors duration-200">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-sidebar z-50 flex flex-col border-r border-sidebar-border shadow-[0_2px_16px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto`}
      >
        <Sidebar
          sessions={sessions}
          onNewChat={onNewChat}
          currentPage={currentPage}
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-0">
        <Header
          chatTitle={chatTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-hidden pt-14">
          {children}
        </main>
      </div>
    </div>
  )
}
