export type Source = {
  content: string
  metadata: {
    standard_id: string
    clause_id: string
    [key: string]: unknown
  }
}

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  isStreaming?: boolean
  timestamp: Date
}

export type ChatSession = {
  id: string
  title: string
  lastMessage?: string
  timestamp: Date
  path: string
}

export type SearchResult = {
  content: string
  metadata: Record<string, unknown>
}
