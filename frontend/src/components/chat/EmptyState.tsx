type EmptyStateProps = {
  onQuickAction: (query: string) => void
}

const QUICK_PROMPTS = [
  {
    icon: 'verified_user',
    label: 'Find Standards',
    query: 'Which Indian Standard applies to self-ballasted LED lamps for general lighting?',
  },
  {
    icon: 'assignment_turned_in',
    label: 'Certification Process',
    query: 'What is the BIS certification process under Scheme-II (CRS) for electronic products?',
  },
  {
    icon: 'workspace_premium',
    label: 'Hallmarking Guide',
    query: 'How does gold hallmarking work in India? What is HUID?',
  },
  {
    icon: 'biotech',
    label: 'Testing Labs',
    query: 'How can I find a BIS recognized NABL accredited testing laboratory?',
  },
]

export default function EmptyState({ onQuickAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-16 md:pt-24 gap-6 text-center px-4">
      {/* Logo */}
      <div className="w-28 h-20 flex items-center justify-center">
        <img
          src="/qubis-logo.png"
          alt="QuBIS Logo"
          className="w-full h-full object-contain drop-shadow-md brightness-105"
        />
      </div>

      <div className="space-y-2">
        <h2 className="text-[28px] font-bold text-text-primary transition-colors">QuBIS Intelligence Assistant</h2>
        <p className="text-[15px] text-text-muted max-w-[460px] transition-colors">
          Ask anything about Indian Standards, BIS certification schemes, hallmarking, HUID verification, or testing laboratories.
        </p>
      </div>

      {/* Quick Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-xl">
        {QUICK_PROMPTS.map(prompt => (
          <button
            key={prompt.label}
            onClick={() => onQuickAction(prompt.query)}
            className="p-4 text-left border border-border rounded-xl bg-surface-card hover:bg-surface-hover hover:border-brand-accent/40 transition-all text-[13px] text-text-secondary group"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary transition-colors">
                {prompt.icon}
              </span>
              <span className="font-semibold text-text-primary text-[14px] transition-colors">{prompt.label}</span>
            </div>
            <p className="text-text-muted leading-relaxed line-clamp-2 transition-colors">{prompt.query}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
