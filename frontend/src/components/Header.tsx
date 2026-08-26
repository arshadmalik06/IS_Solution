import { Link, useLocation } from 'react-router-dom'
import { Globe, Moon } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs))
}

export default function Header() {
  const location = useLocation()
  const isChat = location.pathname === '/chat'

  if (isChat) return null // Chat has its own header

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Features', path: '/#features' },
    { name: 'How it Works', path: '/#how-it-works' },
    { name: 'Capabilities', path: '/#capabilities' },
    { name: 'About BIS', path: 'https://www.bis.gov.in/' },
  ]

  return (
    <header className="relative z-50 w-full h-[88px] flex items-center justify-center border-b border-border">
      <div className="w-full max-w-[1320px] px-6 lg:px-10 flex items-center justify-between">
        {/* Left: Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-bis-blue flex items-center justify-center font-bold text-lg text-white shadow-lg">
            BIS
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[17px] leading-tight tracking-tight">BIS AI Assistant</span>
            <span className="text-[13px] text-text-muted leading-tight">Bureau of Indian Standards</span>
          </div>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={cn(
                "text-[14px] font-medium transition-colors hover:text-white",
                link.name === 'Home' ? "text-white relative" : "text-text-muted"
              )}
            >
              {link.name}
              {link.name === 'Home' && (
                <div className="absolute -bottom-[33px] left-0 right-0 h-[2px] bg-bis-red" />
              )}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-muted hover:text-white transition-colors rounded-lg hover:bg-surface-elevated">
            <Globe className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-muted hover:text-white transition-colors rounded-lg hover:bg-surface-elevated">
            <Moon className="w-5 h-5" />
          </button>
          <Link to="/chat" className="btn-primary flex items-center gap-2 text-[14px] ml-2">
            Open Assistant &rarr;
          </Link>
        </div>
      </div>
    </header>
  )
}
