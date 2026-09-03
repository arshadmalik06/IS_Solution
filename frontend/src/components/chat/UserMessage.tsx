import type { Message } from '../../types'

type UserMessageProps = {
  message: Message
}

export default function UserMessage({ message }: UserMessageProps) {
  const time = message.timestamp.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="flex justify-end w-full my-1">
      <div className="relative w-full max-w-2xl p-4 md:p-5 rounded-2xl rounded-tr-sm shadow-[0_4px_16px_rgba(0,0,0,0.15)] bg-surface-elevated text-text-primary border border-border transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[13px] text-white">person</span>
            </div>
            <span className="text-[12px] font-semibold text-text-primary transition-colors">You</span>
          </div>
        </div>

        {/* Content */}
        <p className="text-[14px] font-normal leading-relaxed text-text-primary transition-colors">
          {message.content}
        </p>

        {/* Timestamp */}
        <div className="flex items-center justify-end gap-1.5 mt-2.5 text-[11px] text-text-muted transition-colors">
          <span>{time}</span>
          <span className="material-symbols-outlined text-[15px] text-brand-accent transition-colors">done_all</span>
        </div>
      </div>
    </div>
  )
}
