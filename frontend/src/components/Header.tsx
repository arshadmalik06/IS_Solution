import { useState } from 'react'

type HeaderProps = {
  chatTitle?: string
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function Header({ chatTitle, onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle')
  const handleExport = () => {
    // Export current chat as text file
    const content = document.querySelector('[data-chat-content]')?.textContent || 'No chat content to export.'
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bis-report-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('copied')
      window.setTimeout(() => setShareStatus('idle'), 1800)
    } catch {
      // Fallback
    }
  }

  return (
    <header className="app-header fixed inset-x-0 top-0 z-40 flex min-h-14 items-center justify-between border-b border-border bg-background/95 px-2 shadow-[0_1px_8px_rgba(0,0,0,0.15)] backdrop-blur-md transition-colors sm:px-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
          aria-label={sidebarOpen ? 'Collapse navigation' : 'Open navigation'}
        >
          <span className="material-symbols-outlined text-[20px] md:hidden">menu</span>
          <span className="material-symbols-outlined hidden text-[20px] md:inline">{sidebarOpen ? 'left_panel_close' : 'left_panel_open'}</span>
        </button>

        {/* Mobile Brand */}
        <div className="flex items-center gap-2 md:hidden">
          <img src="/logo.png" alt="QuBIS" className="h-7 w-auto object-contain" />
          <span className="font-bold text-[16px] text-text-primary tracking-tight">QuBIS</span>
        </div>

        {chatTitle && (
          <div className="hidden min-w-0 max-w-[min(42vw,32rem)] items-center gap-2 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-[14px] font-semibold text-text-primary transition-colors sm:flex">
            <span className="material-symbols-outlined text-[18px] text-brand-accent">chat</span>
            <span className="truncate">{chatTitle}</span>
          </div>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-card p-2 text-[14px] font-semibold text-text-secondary shadow-sm transition-colors hover:bg-surface-elevated hover:text-text-primary sm:px-3 sm:py-1.5"
          aria-label={shareStatus === 'copied' ? 'Link copied' : 'Copy page link'}
        >
          <span className="material-symbols-outlined text-[16px] text-text-muted">ios_share</span>
          <span className="hidden sm:inline">{shareStatus === 'copied' ? 'Copied' : 'Share'}</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-card p-2 text-[14px] font-semibold text-text-secondary shadow-sm transition-colors hover:bg-surface-elevated hover:text-text-primary sm:px-3 sm:py-1.5"
          aria-label="Export chat report"
        >
          <span className="material-symbols-outlined text-[16px] text-text-muted">download</span>
          <span className="hidden sm:inline">Export BIS Report</span>
        </button>

        <a
          href="https://www.bis.gov.in/?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg bg-[#E9441F] p-2 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-[#CC3A1A] sm:px-3.5 sm:py-1.5"
          aria-label="Open BIS Portal"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span className="hidden sm:inline">BIS Portal</span>
        </a>

        <div className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-elevated text-xs font-semibold text-text-primary shadow-sm transition-colors sm:flex" aria-label="User profile">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  )
}
