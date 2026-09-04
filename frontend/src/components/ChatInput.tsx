import { useState, useRef, useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'
import VoiceAssistantWidget from './voice/VoiceAssistantWidget'

type ChatInputProps = {
  onSend: (text: string) => void
  isLoading: boolean
  isInitialState?: boolean
}

export default function ChatInput({ onSend, isLoading, isInitialState = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false)
  const { settings } = useSettings()

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = Math.min(el.scrollHeight, 128) + 'px'
    }
  }, [input])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSend(input.trim())
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (settings.chatPreferences.enterToSubmit) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    }
  }

  const wrapperClasses = `chat-input-wrapper fixed inset-x-0 pointer-events-none z-30 flex flex-col items-center px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:p-4 sm:pb-6 ${isInitialState ? 'bottom-[max(1rem,calc(50%-11rem))]' : 'bottom-0'
    }`

  const innerClasses = `w-full pointer-events-auto flex flex-col space-y-2.5 transition-[max-width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isInitialState ? 'max-w-2xl' : 'max-w-4xl'
    }`

  const placeholderText = "Ask Anything"

  return (
    <div className={wrapperClasses}>
      <div className={innerClasses}>
        {/* Input Dock */}
        <div className="relative flex items-end gap-1.5 rounded-2xl border border-border bg-surface-elevated p-2 pl-2 shadow-[0_8px_28px_rgba(0,0,0,0.15)] transition-colors sm:items-center sm:gap-3 sm:p-2.5 sm:pl-4">

          <button
            type="button"
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isAttachmentOpen
                ? 'text-brand-primary bg-surface-hover'
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
            title="Attach product technical specifications or test lab certificate"
            aria-label="Attach a document"
          >
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>

          {/* Attachment Popup Menu */}
          {isAttachmentOpen && (
            <>
              {/* Invisible Backdrop to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsAttachmentOpen(false)}
              />
              <div className="absolute bottom-full left-0 z-50 mb-3 flex max-w-[calc(100vw-1.5rem)] origin-bottom-left flex-col gap-1 rounded-xl border border-border bg-surface-card p-3 shadow-xl animate-fade-in-up">
                <div className="text-[13px] font-medium text-text-primary whitespace-nowrap">
                  Feature not available
                </div>
              </div>
            </>
          )}

          <textarea
            ref={textareaRef}
            style={{ outline: 'none', boxShadow: 'none' }}
            className="min-w-0 flex-1 resize-none border-0 bg-transparent py-1 text-[15px] text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus-visible:outline-none"
            placeholder={placeholderText}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
            <VoiceAssistantWidget
              onTranscribed={text => setInput(prev => (prev ? prev + ' ' + text : text))}
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center transition-all hover:scale-105 shadow-[0_2px_12px_rgba(29,111,229,0.35)] disabled:opacity-50 disabled:hover:scale-100"
              title="Send statutory prompt"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isLoading ? 'hourglass_empty' : 'arrow_upward'}
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
