import { useState } from 'react'
import type { Source } from '../../types'

type SourcesBarProps = {
  sources: Source[]
}

export default function SourcesBar({ sources }: SourcesBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sourceIds = sources
    .map(s => s.metadata.standard_id)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(' • ')

  return (
    <div className="p-3.5 px-4 rounded-xl bg-surface-card shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-border transition-colors">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-elevated border border-border flex items-center justify-center transition-colors p-1">
            <img src="/qubis-logo.png" alt="QuBIS" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] text-text-primary font-bold tracking-tight transition-colors">QuBIS Intelligence</span>
            <span className="px-2.5 py-0.5 rounded-full bg-status-success/15 text-status-success text-[11px] flex items-center gap-1 font-bold border border-status-success/25 transition-colors">
              <span className="material-symbols-outlined text-[13px]">verified</span>verified
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-border transition-colors text-[14px] font-semibold text-text-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-brand-accent">manage_search</span>
            <span className="text-text-primary">Searched {sources.length} BIS documents</span>
            {sourceIds && (
              <span className="font-mono text-[11px] text-text-muted font-normal ml-1 hidden md:inline transition-colors">{sourceIds}</span>
            )}
            <span className={`material-symbols-outlined text-[16px] text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              keyboard_arrow_down
            </span>
          </button>
        </div>
      </div>

      {/* Expanded Sources */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border space-y-2 transition-colors">
          {sources.map((source, i) => (
            <div key={i} className="flex items-start gap-2 text-[12px]">
              <span className="material-symbols-outlined text-[15px] text-status-success mt-0.5">check_circle</span>
              <div>
                <span className="text-text-primary font-semibold transition-colors">{source.metadata.standard_id}</span>
                <span className="text-text-muted transition-colors"> — Clause {source.metadata.clause_id}</span>
                <p className="text-text-secondary mt-1 line-clamp-2 transition-colors">{source.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
