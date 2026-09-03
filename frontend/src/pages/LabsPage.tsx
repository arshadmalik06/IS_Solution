import { useState } from 'react'
import Layout from '../components/Layout'
import { useChat } from '../hooks/useChat'
import { useSearch } from '../hooks/useSearch'
import type { SearchResult } from '../types'

export default function LabsPage() {
  const { sessions, clearChat } = useChat()
  const { results, isLoading, error, search, clearResults } = useSearch()
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      search(`testing laboratory ${searchInput.trim()}`)
    }
  }

  return (
    <Layout
      sessions={sessions}
      onNewChat={clearChat}
      currentPage="labs"
      chatTitle="Lab & HUID Directory"
    >
      <div className="flex-1 overflow-y-auto px-6 md:px-10 lg:px-12 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold text-text-primary flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined text-[32px] text-brand-accent">biotech</span>
              Lab & HUID Directory
            </h1>
            <p className="text-[15px] text-text-muted max-w-xl transition-colors">
              Find BIS-recognized NABL accredited testing laboratories and verify HUID (Hallmark Unique Identification) numbers for gold jewellery.
            </p>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-surface-card border border-border space-y-3 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[22px] text-brand-accent">science</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary transition-colors">Testing Laboratories</h3>
                  <p className="text-[11px] text-text-muted transition-colors">NABL accredited labs for BIS certification</p>
                </div>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed transition-colors">
                Search for BIS-recognized laboratories based on product category, location, or testing capability.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-surface-card border border-border space-y-3 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[22px] text-brand-accent">workspace_premium</span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-text-primary transition-colors">HUID Verification</h3>
                  <p className="text-[11px] text-text-muted transition-colors">Hallmark Unique Identification lookup</p>
                </div>
              </div>
              <p className="text-[13px] text-text-secondary leading-relaxed transition-colors">
                Verify the authenticity of hallmarked gold jewellery using the HUID number engraved on the item.
              </p>
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-card border border-border focus-within:border-brand-primary transition-colors">
              <span className="material-symbols-outlined text-[20px] text-brand-accent">search</span>
              <input
                className="flex-1 bg-transparent border-0 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
                placeholder="Search labs by product, location, or capability..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); clearResults() }}
                  className="text-text-muted hover:text-text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!searchInput.trim() || isLoading}
              className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-hover transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">biotech</span>
              {isLoading ? 'Searching...' : 'Search Labs'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 text-red-500 text-[14px] flex items-center gap-3 transition-colors">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-[16px] font-semibold text-text-primary transition-colors">
                Found {results.length} relevant result{results.length !== 1 ? 's' : ''}
              </h2>
              <div className="space-y-3">
                {results.map((result: SearchResult, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-card border border-border hover:border-brand-accent/40 transition-all space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-brand-accent transition-colors">science</span>
                      <span className="font-semibold text-text-primary text-[14px] transition-colors">
                        {String(result.metadata.standard_id || 'BIS Document')}
                      </span>
                      {result.metadata.clause_id ? (
                        <span className="text-[12px] text-text-muted font-mono transition-colors">
                          Section {String(result.metadata.clause_id)}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[13px] leading-relaxed text-text-secondary transition-colors">
                      {result.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-12 space-y-4">
              <span className="material-symbols-outlined text-[48px] text-text-muted opacity-50 transition-colors">biotech</span>
              <p className="text-text-muted text-[15px] transition-colors">Search for a testing laboratory or enter a HUID number.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
