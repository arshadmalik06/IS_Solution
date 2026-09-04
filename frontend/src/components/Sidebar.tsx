import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import type { ChatSession } from '../types'

type SidebarProps = {
  sessions: ChatSession[]
  onNewChat: () => void
  currentPage: string
  onCloseMobile: () => void
}

const NAV_ITEMS = [
  { path: '/', icon: 'smart_toy', label: 'QuBIS Assistant', key: 'assistant' },
]

export default function Sidebar({ sessions, onNewChat, currentPage: _currentPage, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNav = (path: string) => {
    navigate(path)
    onCloseMobile()
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex flex-col h-full overflow-hidden text-sidebar-text bg-sidebar">
      {/* Logo Header */}
      <div className="p-4 flex items-center border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="QuBIS Logo"
            className="h-8 w-auto object-contain drop-shadow-sm brightness-105"
          />
          <div className="flex flex-col">
            <span className="text-sidebar-text-active font-bold text-[18px] leading-tight" style={{ letterSpacing: '-0.02em' }}>QuBIS</span>
            <span className="text-[10px] text-sidebar-text tracking-wider font-medium">Bureau of Indian Standards</span>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => { onNewChat(); handleNav('/') }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#E9441F] text-white hover:bg-[#CC3A1A] transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-white/80 group-hover:text-white transition-colors">edit_square</span>
            <span className="text-[14px] font-semibold">New chat</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-white/80 group-hover:translate-x-0.5 transition-transform">add</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-surface text-sidebar-text border border-sidebar-border focus-within:border-brand-primary transition-colors">
          <span className="material-symbols-outlined text-[16px] text-brand-accent">search</span>
          <input
            className="w-full bg-transparent border-0 text-[14px] text-sidebar-text-active placeholder:text-sidebar-text focus:outline-none"
            placeholder="Search standards & chats..."
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-5">
        {/* BIS Services */}
        <div className="space-y-1.5">
          <span className="px-2 text-[11px] uppercase tracking-wider text-sidebar-text font-semibold">BIS Services</span>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all text-left relative overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-[#E9441F] text-white font-semibold shadow-sm'
                    : 'text-sidebar-text hover:bg-sidebar-surface hover:text-sidebar-text-active'
                }`}
              >
                {isActive(item.path) && (
                  <span className="w-1 h-4 bg-white rounded-full absolute left-1 top-1/2 -translate-y-1/2" />
                )}
                <span className={`material-symbols-outlined text-[18px] ${isActive(item.path) ? '' : 'text-brand-accent'} ${isActive(item.path) ? 'ml-1' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[14px] font-medium truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Recents */}
        <div className="space-y-1.5">
          <span className="px-2 text-[11px] uppercase tracking-wider text-sidebar-text font-semibold">Recents</span>
          <nav className="space-y-0.5">
            {filteredSessions.slice(0, 6).map((session, i) => (
              <button
                key={session.id}
                onClick={() => handleNav('/')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                  i === 0
                    ? 'bg-sidebar-surface text-sidebar-text-active font-medium'
                    : 'text-sidebar-text hover:bg-sidebar-surface hover:text-sidebar-text-active'
                }`}
              >
                <span className={`material-symbols-outlined text-[16px] ${i === 0 ? 'text-brand-accent' : 'text-sidebar-text'}`}>chat_bubble</span>
                <span className="text-[13px] truncate">{session.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        {/* User Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-primary border border-white/20 flex items-center justify-center shadow-sm text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[13px] text-sidebar-text-active font-semibold truncate">User</span>
              <span className="text-[11px] text-brand-accent truncate font-medium">MSME Licensee</span>
            </div>
          </div>
          <button 
            onClick={() => handleNav('/settings')}
            className="p-1.5 rounded-lg text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>

        {/* Language */}
        <div className="flex items-center justify-between pt-1 border-t border-sidebar-border">
          <span className="text-[12px] text-sidebar-text flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">translate</span>
            English
          </span>
          <span className="text-[10px] text-sidebar-text tracking-wider font-medium truncate">Bureau of Indian Standards</span>
        </div>
      </div>
    </div>
  )
}
