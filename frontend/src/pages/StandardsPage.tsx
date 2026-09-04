import { useState } from 'react'
import Layout from '../components/Layout'
import { useChat } from '../hooks/useChat'
import { useSearch } from '../hooks/useSearch'
import type { SearchResult } from '../types'

export default function StandardsPage() {
  const { sessions, clearChat } = useChat()
  const { results, isLoading, error, search, clearResults } = useSearch()
  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      search(searchInput.trim())
    }
  }

  return (
    <Layout
      sessions={sessions}
      onNewChat={clearChat}
      currentPage="standards"
      chatTitle="Standard Recommender"
    >
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 md:px-10 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="flex items-start gap-3 text-2xl font-bold leading-tight text-text-primary transition-colors sm:items-center sm:text-[28px]">
              <span className="material-symbols-outlined flex-shrink-0 text-[28px] text-brand-accent sm:text-[32px]">verified</span>
              Standard Recommender
            </h1>
            <p className="text-[15px] text-text-muted max-w-xl transition-colors">
              Search for applicable Indian Standards by product, category, or keywords. Find the right BIS standard for your manufacturing or compliance needs.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-surface-card px-4 py-3 transition-colors focus-within:border-brand-primary">
              <span className="material-symbols-outlined text-[20px] text-brand-accent">search</span>
              <input
                className="min-w-0 flex-1 border-0 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
                placeholder="Search by product, standard number, or keyword..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); clearResults() }}
                  className="flex-shrink-0 text-text-muted transition-colors hover:text-text-primary"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={!searchInput.trim() || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-brand-hover disabled:opacity-50 sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">manage_search</span>
              {isLoading ? 'Searching...' : 'Search Standards'}
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
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-[16px] font-semibold text-text-primary transition-colors">
                  Found {results.length} relevant standard{results.length !== 1 ? 's' : ''}
                </h2>
                <span className="text-[12px] text-text-muted font-mono transition-colors">via BIS Vector Database</span>
              </div>

              <div className="space-y-3">
                {results.map((result: SearchResult, i: number) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-surface-card border border-border hover:border-brand-accent/40 transition-all space-y-3"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] text-brand-accent transition-colors">description</span>
                        <span className="min-w-0 break-words font-semibold text-[14px] text-text-primary transition-colors">
                          {String(result.metadata.standard_id || 'BIS Standard')}
                        </span>
                        {result.metadata.clause_id ? (
                          <span className="text-[12px] text-text-muted font-mono transition-colors">
                            Clause {String(result.metadata.clause_id)}
                          </span>
                        ) : null}
                      </div>
                      <span className="flex w-fit items-center gap-1 self-start rounded-full border border-status-success/25 bg-status-success/15 px-2.5 py-0.5 text-[11px] font-bold text-status-success transition-colors sm:self-auto">
                        <span className="material-symbols-outlined text-[13px]">verified</span>
                        Retrieved
                      </span>
                    </div>

                    <p className="text-[13px] leading-relaxed text-text-secondary line-clamp-4 transition-colors">
                      {result.content}
                    </p>

                    <div className="flex flex-col gap-2 border-t border-border pt-2 transition-colors sm:flex-row sm:items-center sm:justify-between">
                      <span className="text-[11px] text-text-muted transition-colors">BIS Vector Database</span>
                      <a
                        href="https://www.services.bis.gov.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[12px] font-semibold text-brand-accent hover:text-brand-primary transition-colors"
                      >
                        Verify at BIS Manak
                        <span className="material-symbols-outlined text-[13px]">launch</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && results.length === 0 && !error && (
            <div className="text-center py-16 space-y-4">
              <span className="material-symbols-outlined text-[48px] text-text-muted opacity-50 transition-colors">verified_user</span>
              <p className="text-text-muted text-[15px] transition-colors">Search for an Indian Standard to see results here.</p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {['LED lamps', 'Cement', 'Plywood', 'Packaged water', 'Steel', 'Toys'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setSearchInput(term); search(term) }}
                    className="px-3 py-1.5 rounded-lg bg-surface-card border border-border text-[13px] text-text-secondary hover:text-text-primary hover:border-brand-accent/40 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
