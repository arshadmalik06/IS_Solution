import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import type { ChatSession } from '../types'

type SidebarProps = {
  sessions: ChatSession[]
  onNewChat: () => void
  currentPage: string
  onCloseMobile: () => void
}

const NAV_ITEMS = [
  { path: '/', icon: 'smart_toy', label: 'QuBIS Assistant', key: 'assistant' },
  { path: '/standards', icon: 'verified', label: 'Standard Recommender', key: 'standards' },
  { path: '/labs', icon: 'biotech', label: 'Lab & HUID Directory', key: 'labs' },
]

export default function Sidebar({ sessions, onNewChat, currentPage: _currentPage, onCloseMobile }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
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
      <div className="p-4 flex items-center justify-between gap-2 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <img
            src="/qubis-logo.png"
            alt="QuBIS Logo"
            className="h-8 w-auto object-contain drop-shadow-sm brightness-105"
          />
          <div className="flex flex-col">
            <span className="text-white font-bold text-[16px] leading-tight tracking-tight">QuBIS</span>
            <span className="text-[10px] text-white/70 tracking-wider font-medium">Bureau of Indian Standards</span>
          </div>
        </div>
        <button
          onClick={() => { onNewChat(); handleNav('/') }}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary text-white hover:bg-brand-hover transition-all shadow-sm"
          title="New Chat"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => { onNewChat(); handleNav('/') }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-hover transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-white/80 group-hover:text-white transition-colors">edit_square</span>
            <span className="text-[13px] font-semibold">New chat</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-white/80 group-hover:translate-x-0.5 transition-transform">add</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-surface text-sidebar-text border border-sidebar-border focus-within:border-brand-primary transition-colors">
          <span className="material-symbols-outlined text-[16px] text-brand-accent">search</span>
          <input
            className="w-full bg-transparent border-0 text-[13px] text-sidebar-text-active placeholder:text-sidebar-text focus:outline-none"
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
          <span className="px-2 text-[11px] uppercase tracking-wider text-sidebar-text font-bold">BIS Services</span>
          <nav className="space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.key}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left relative overflow-hidden ${
                  isActive(item.path)
                    ? 'bg-brand-primary text-white font-semibold shadow-sm'
                    : 'text-sidebar-text hover:bg-sidebar-surface hover:text-sidebar-text-active'
                }`}
              >
                {isActive(item.path) && (
                  <span className="w-1 h-4 bg-white rounded-full absolute left-1 top-1/2 -translate-y-1/2" />
                )}
                <span className={`material-symbols-outlined text-[18px] ${isActive(item.path) ? '' : 'text-brand-accent'} ${isActive(item.path) ? 'ml-1' : ''}`}>
                  {item.icon}
                </span>
                <span className="text-[13px] truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Recents */}
        <div className="space-y-1.5">
          <span className="px-2 text-[11px] uppercase tracking-wider text-sidebar-text font-bold">Recents</span>
          <nav className="space-y-0.5">
            {filteredSessions.slice(0, 6).map((session, i) => (
              <button
                key={session.id}
                onClick={() => handleNav('/')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors text-left ${
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
        {/* Theme */}
        <div className="flex items-center justify-between pb-2 mb-1 border-b border-sidebar-border">
          <span className="text-[11px] font-medium text-sidebar-text flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px] text-brand-accent">tune</span>
            Theme
          </span>
          <button
            onClick={toggleTheme}
            className="group flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-sidebar-surface hover:bg-sidebar-border border border-sidebar-border transition-all shadow-sm text-sidebar-text-active"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className="material-symbols-outlined text-[15px] text-brand-accent">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="text-[11px] font-semibold ml-0.5 whitespace-nowrap">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-brand-primary border border-white/20 flex items-center justify-center shadow-sm text-white">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div className="flex flex-col truncate">
              <span className="text-[13px] text-sidebar-text-active font-semibold truncate">Vikram Sharma</span>
              <span className="text-[11px] text-brand-accent truncate font-semibold">MSME Licensee</span>
            </div>
          </div>
          <button className="p-1.5 rounded-lg text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-surface transition-colors">
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
