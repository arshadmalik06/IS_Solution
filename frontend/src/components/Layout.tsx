import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import type { ChatSession } from '../types'

type LayoutProps = {
  children: React.ReactNode
  sessions: ChatSession[]
  onNewChat: () => void
  onSelectSession?: (sessionId: string) => void
  currentPage: string
  chatTitle?: string
}

export default function Layout({ children, sessions, onNewChat, onSelectSession, currentPage, chatTitle }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const savedWidth = Number(localStorage.getItem('qubis_sidebar_width'))
    return Number.isFinite(savedWidth) && savedWidth >= 224 && savedWidth <= 420 ? savedWidth : 288
  })
  const isResizing = useRef(false)

  useEffect(() => {
    localStorage.setItem('qubis_sidebar_width', String(sidebarWidth))
  }, [sidebarWidth])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isResizing.current) return
      setSidebarWidth(Math.min(420, Math.max(224, event.clientX)))
    }

    const stopResizing = () => {
      isResizing.current = false
      document.body.classList.remove('sidebar-resizing')
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResizing)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopResizing)
    }
  }, [])

  const startResizing = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    isResizing.current = true
    document.body.classList.add('sidebar-resizing')
  }

  const shellStyle = { '--sidebar-size': `${sidebarWidth}px` } as CSSProperties

  return (
    <div
      className="layout-shell flex h-screen overflow-hidden bg-background text-text-primary transition-colors duration-200"
      data-sidebar-collapsed={!sidebarOpen}
      style={shellStyle}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`layout-sidebar fixed left-0 top-0 z-50 flex h-full shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar shadow-[0_2px_16px_rgba(0,0,0,0.5)] transition-[width,transform] duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:z-auto`}
      >
        <Sidebar
          sessions={sessions}
          onNewChat={onNewChat}
          onSelectSession={onSelectSession}
          currentPage={currentPage}
          onCloseMobile={() => setSidebarOpen(false)}
        />
        <div
          className="absolute right-0 top-0 z-20 hidden h-full w-2 translate-x-1/2 cursor-col-resize md:block"
          role="separator"
          aria-label="Resize sidebar"
          aria-orientation="vertical"
          aria-valuemin={224}
          aria-valuemax={420}
          aria-valuenow={sidebarWidth}
          tabIndex={0}
          onPointerDown={startResizing}
          onDoubleClick={() => setSidebarWidth(288)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft') setSidebarWidth(width => Math.max(224, width - 16))
            if (event.key === 'ArrowRight') setSidebarWidth(width => Math.min(420, width + 16))
          }}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-0">
        <Header
          chatTitle={chatTitle}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-hidden pt-14">
          {children}
        </main>
      </div>
    </div>
  )
}
