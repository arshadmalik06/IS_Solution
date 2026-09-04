import { apiRequest } from './connection'
import type { SearchResult } from '../types'

export async function searchDocuments(
  query: string,
  topK: number = 4
): Promise<{ results: SearchResult[] }> {
  return apiRequest<{ results: SearchResult[] }>('/api/search', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK }),
  })
}
