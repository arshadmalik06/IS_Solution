import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../../types'
import SourcesBar from './SourcesBar'
import LoadingIndicator from './LoadingIndicator'
import { SpeakerButton } from '../voice/VoiceAssistantWidget'

type AssistantMessageProps = {
  message: Message
}

export default function AssistantMessage({ message }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false)
  const [isHelpful, setIsHelpful] = useState(false)
  const time = message.timestamp.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch { /* Clipboard access is unavailable. */ }
  }

  const handleForward = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'QuBIS response', text: message.content })
      } else {
        await navigator.clipboard.writeText(message.content)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
      }
    } catch {
      // The user dismissed the native share dialog or sharing is unavailable.
    }
  }

  return (
    <div className="flex w-full my-1 justify-start">
      <div className="relative w-full max-w-4xl space-y-3">
        {/* Sources Bar */}
        {message.sources && message.sources.length > 0 && (
          <SourcesBar sources={message.sources} />
        )}

        {/* Main Response Card */}
        <div className="p-5 md:p-6 rounded-2xl rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.15)] bg-surface-card border border-border transition-colors">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-border mb-4 transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-surface-elevated border border-border shadow-sm p-1">
                <img src="/logo.png" alt="QuBIS" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-text-primary leading-tight tracking-tight transition-colors">QuBIS Verified Assistant</h3>
                <p className="text-[11px] text-text-muted transition-colors">Bureau of Indian Standards Statutory Intelligence</p>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-status-green/15 text-status-green border border-status-green/25 flex items-center gap-1 ml-2 transition-colors">
                <span className="material-symbols-outlined text-[13px]">verified</span>verified
              </span>
            </div>
            <span className="text-[11px] text-text-muted font-medium transition-colors">{time}</span>
          </div>

          {/* Content */}
          {message.content ? (
            <div className="prose-qubis" data-chat-content>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : message.isStreaming ? (
            <LoadingIndicator />
          ) : null}

          {/* Action Buttons */}
          {!message.isStreaming && message.content && (
            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 transition-colors sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-brand-primary text-white shadow-sm">
                  <span className="material-symbols-outlined text-[17px]">info</span>
                </div>
                <p className="text-[14px] leading-relaxed text-text-secondary transition-colors">
                  <span className="font-semibold text-text-primary">Note: </span>
                  Always cross-verify statutory clauses with official BIS Gazette publications for commercial production.
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 text-text-muted transition-colors">
                <SpeakerButton text={message.content} />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-surface-elevated hover:text-text-primary"
                  title={copied ? 'Copied' : 'Copy'}
                  aria-label={copied ? 'Response copied' : 'Copy response'}
                >
                  <span className="material-symbols-outlined text-[17px]">content_copy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsHelpful(!isHelpful)}
                  aria-pressed={isHelpful}
                  className={`rounded-lg border p-1.5 transition-colors ${isHelpful ? 'border-brand-primary/40 bg-brand-primary/10 text-brand-primary' : 'border-transparent hover:border-border hover:bg-surface-elevated hover:text-text-primary'}`}
                  title={isHelpful ? 'Marked helpful' : 'Mark as helpful'}
                  aria-label={isHelpful ? 'Marked as helpful' : 'Mark response as helpful'}
                >
                  <span className="material-symbols-outlined text-[17px]">thumb_up</span>
                </button>
                <button
                  type="button"
                  onClick={handleForward}
                  className="rounded-lg border border-transparent p-1.5 transition-colors hover:border-border hover:bg-surface-elevated hover:text-text-primary"
                  title="Share response"
                  aria-label="Share response"
                >
                  <span className="material-symbols-outlined text-[17px]">forward</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp below card */}
        <div className="flex items-center justify-end text-[11px] pt-1 text-text-muted transition-colors">
          <span>{time}</span>
        </div>
      </div>
    </div>
  )
}
