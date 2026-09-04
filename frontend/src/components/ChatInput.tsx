import { useState, useRef, useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'

type ChatInputProps = {
  onSend: (text: string) => void
  isLoading: boolean
  isInitialState?: boolean
}

export default function ChatInput({ onSend, isLoading, isInitialState = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isListening, setIsListening] = useState(false)
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

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + transcript)
    }
    recognition.onerror = () => setIsListening(false)

    if (isListening) {
      recognition.stop()
    } else {
      recognition.start()
    }
  }

  const handleAttachmentClick = (_type: string) => {
    // In a real app, we could store the 'type' to process the file differently.
    setIsAttachmentOpen(false)
    fileInputRef.current?.click()
  }

  const wrapperClasses = `chat-input-wrapper fixed inset-x-0 pointer-events-none z-30 flex flex-col items-center px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:p-4 sm:pb-6 ${
    isInitialState ? 'bottom-[max(1rem,calc(50%-11rem))]' : 'bottom-0'
  }`

  const innerClasses = `w-full pointer-events-auto flex flex-col space-y-2.5 transition-[max-width] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
    isInitialState ? 'max-w-2xl' : 'max-w-4xl'
  }`

  const placeholderText = "Ask Anything"

  return (
    <div className={wrapperClasses}>
      <div className={innerClasses}>
        {/* Input Dock */}
        <div className="relative flex items-end gap-1.5 rounded-2xl border border-border bg-surface-elevated p-2 pl-2 shadow-[0_8px_28px_rgba(0,0,0,0.15)] transition-colors sm:items-center sm:gap-3 sm:p-2.5 sm:pl-4">
          
          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} className="hidden" multiple />

          <button
            type="button"
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
              isAttachmentOpen 
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
              <div className="absolute bottom-full left-0 z-50 mb-3 flex w-64 max-w-[calc(100vw-1.5rem)] origin-bottom-left flex-col gap-1 rounded-xl border border-border bg-surface-card p-2 shadow-xl animate-fade-in-up">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Attach Document
                </div>
                
                <button type="button" onClick={() => handleAttachmentClick('pdf')} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">picture_as_pdf</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Upload PDF Document</span>
                  </div>
                </button>
                
                <button type="button" onClick={() => handleAttachmentClick('test-report')} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">science</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Upload Test Report</span>
                  </div>
                </button>

                <button type="button" onClick={() => handleAttachmentClick('specs')} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">description</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Product Specifications</span>
                  </div>
                </button>

                <button type="button" onClick={() => handleAttachmentClick('certificate')} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">workspace_premium</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">BIS Certificate / License</span>
                  </div>
                </button>

                <button type="button" onClick={() => handleAttachmentClick('gazette')} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-surface-hover group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">gavel</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Gazette Notification</span>
                  </div>
                </button>
              </div>
            </>
          )}

          <textarea
            ref={textareaRef}
            style={{ outline: 'none', boxShadow: 'none' }}
            className="min-w-0 flex-1 resize-none border-0 bg-transparent py-1 text-[14px] text-text-primary placeholder:text-text-muted transition-all duration-200 focus:outline-none focus-visible:outline-none"
            placeholder={placeholderText}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'text-red-400 bg-red-400/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
              title="Voice Input (English / Hindi / Regional)"
              aria-label="Start voice input"
            >
              <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic'}</span>
            </button>

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
