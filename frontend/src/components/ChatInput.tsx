import { useState, useRef, useEffect } from 'react'
import { useSettings } from '../hooks/useSettings'

type ChatInputProps = {
  onSend: (text: string) => void
  isLoading: boolean
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isListening, setIsListening] = useState(false)
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

  return (
    <div className="fixed bottom-0 left-0 md:left-72 right-0 pointer-events-none z-30 p-4 pb-6 flex flex-col items-center">
      <div className="w-full max-w-4xl pointer-events-auto flex flex-col space-y-2.5">
        {/* Input Dock */}
        <div className="p-2.5 pl-4 rounded-2xl bg-surface-elevated shadow-[0_8px_28px_rgba(0,0,0,0.15)] border border-border flex items-center gap-3 transition-colors">
          <button
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors flex-shrink-0"
            title="Attach product technical specifications or test lab certificate"
          >
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>

          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-0 focus:outline-none resize-none text-[14px] text-text-primary placeholder:text-text-muted max-h-32 py-1"
            placeholder="Ask QuBIS anything about Indian Standards, BIS certification schemes, HUID or testing labs..."
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

        {/* Disclaimer */}
        <p className="text-center text-[11px] text-text-muted px-4">
          QuBIS retrieves grounded knowledge from official BIS Gazette documents & Indian Standards. Always cross-verify statutory clauses for commercial production.
        </p>
      </div>
    </div>
  )
}
