import { useState, useCallback } from 'react'
import { searchDocuments } from '../api/search'
import type { SearchResult } from '../types'

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const search = useCallback(async (searchQuery: string, topK: number = 4) => {
    if (!searchQuery.trim()) return

    setQuery(searchQuery)
    setIsLoading(true)
    setError(null)

    try {
      const data = await searchDocuments(searchQuery, topK)
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    setQuery('')
    setError(null)
  }, [])

  return {
    results,
    isLoading,
    error,
    query,
    search,
    clearResults,
  }
}
