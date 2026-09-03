type HeaderProps = {
  chatTitle?: string
  onToggleSidebar: () => void
}

export default function Header({ chatTitle, onToggleSidebar }: HeaderProps) {
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
      // Could add a toast notification here
    } catch {
      // Fallback
    }
  }

  return (
    <header className="fixed top-0 right-0 left-0 md:left-72 h-14 bg-background/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.15)] border-b border-border z-40 flex items-center justify-between px-4 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>

        {/* Mobile Brand */}
        <div className="md:hidden flex items-center gap-2">
          <img src="/qubis-logo.png" alt="QuBIS" className="h-7 w-auto object-contain" />
          <span className="font-bold text-[15px] text-text-primary">QuBIS</span>
        </div>

        {chatTitle && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-text-primary text-[14px] font-semibold transition-colors">
            <span className="material-symbols-outlined text-[18px] text-brand-accent">chat</span>
            <span className="inline">{chatTitle}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors text-[14px] font-medium shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-text-muted">ios_share</span>
          <span className="hidden sm:inline">Share</span>
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors text-[14px] font-medium shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-text-muted">download</span>
          <span className="hidden sm:inline">Export BIS Report</span>
        </button>

        <a
          href="https://www.bis.gov.in/?lang=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E9441F] text-white hover:bg-[#CC3A1A] transition-all text-[14px] font-semibold shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span className="hidden sm:inline">BIS Portal</span>
        </a>

        <div className="w-8 h-8 rounded-full bg-surface-elevated border border-border text-text-primary flex items-center justify-center ml-1 font-semibold text-xs shadow-sm transition-colors">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>
    </header>
  )
}
