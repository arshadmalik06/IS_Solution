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

  const handleAttachmentClick = (type: string) => {
    // In a real app, we could store the 'type' to process the file differently.
    setIsAttachmentOpen(false)
    fileInputRef.current?.click()
  }

  const wrapperClasses = `fixed left-0 md:left-72 right-0 pointer-events-none z-30 p-4 pb-6 flex flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
    isInitialState ? 'bottom-[45%] translate-y-1/2' : 'bottom-0 translate-y-0'
  }`

  const innerClasses = `w-full pointer-events-auto flex flex-col space-y-2.5 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
    isInitialState ? 'max-w-2xl' : 'max-w-4xl'
  }`

  const placeholderText = "Ask Anything"

  return (
    <div className={wrapperClasses}>
      <div className={innerClasses}>
        {/* Input Dock */}
        <div className="relative p-2.5 pl-4 rounded-2xl bg-surface-elevated shadow-[0_8px_28px_rgba(0,0,0,0.15)] border border-border flex items-center gap-3 transition-colors">
          
          {/* Hidden File Input */}
          <input type="file" ref={fileInputRef} className="hidden" multiple />

          <button
            onClick={() => setIsAttachmentOpen(!isAttachmentOpen)}
            className={`p-2 rounded-xl transition-colors flex-shrink-0 ${
              isAttachmentOpen 
                ? 'text-brand-primary bg-surface-hover' 
                : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
            }`}
            title="Attach product technical specifications or test lab certificate"
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
              <div className="absolute bottom-full mb-3 left-0 bg-surface-card border border-border rounded-xl shadow-xl p-2 w-64 z-50 animate-fade-in-up origin-bottom-left flex flex-col gap-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                  Attach Document
                </div>
                
                <button onClick={() => handleAttachmentClick('pdf')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover text-left transition-colors group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">picture_as_pdf</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Upload PDF Document</span>
                  </div>
                </button>
                
                <button onClick={() => handleAttachmentClick('test-report')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover text-left transition-colors group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">science</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Upload Test Report</span>
                  </div>
                </button>

                <button onClick={() => handleAttachmentClick('specs')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover text-left transition-colors group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">description</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">Product Specifications</span>
                  </div>
                </button>

                <button onClick={() => handleAttachmentClick('certificate')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover text-left transition-colors group">
                  <span className="material-symbols-outlined text-[18px] text-brand-accent group-hover:text-brand-primary">workspace_premium</span>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-text-primary">BIS Certificate / License</span>
                  </div>
                </button>

                <button onClick={() => handleAttachmentClick('gazette')} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-hover text-left transition-colors group">
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
            className="flex-1 bg-transparent border-0 focus:outline-none focus-visible:outline-none resize-none text-[14px] text-text-primary placeholder:text-text-muted max-h-32 py-1 transition-all duration-700"
            placeholder={placeholderText}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />

          <div className="flex items-center gap-1.5 flex-shrink-0 pr-1">
            <button
              onClick={handleVoiceInput}
              className={`p-2 rounded-xl transition-colors ${
                isListening
                  ? 'text-red-400 bg-red-400/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
              }`}
              title="Voice Input (English / Hindi / Regional)"
            >
              <span className="material-symbols-outlined text-[20px]">{isListening ? 'mic' : 'mic'}</span>
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center transition-all hover:scale-105 shadow-[0_2px_12px_rgba(29,111,229,0.35)] disabled:opacity-50 disabled:hover:scale-100"
              title="Send statutory prompt"
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
