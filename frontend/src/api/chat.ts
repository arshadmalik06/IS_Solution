import { API_BASE_URL } from './connection'
import type { Source } from '../types'

export type ChatStreamCallbacks = {
  onSources: (sources: Source[]) => void
  onToken: (token: string) => void
  onError: (error: Error) => void
  onComplete: () => void
}

export async function streamChat(
  query: string,
  sessionId: string = 'default',
  callbacks: ChatStreamCallbacks
): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, session_id: sessionId }),
    })

    if (!response.ok) {
      throw new Error(`Chat API Error: ${response.status} ${response.statusText}`)
    }
    if (!response.body) {
      throw new Error('No readable stream available from the server.')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            if (data.sources) {
              callbacks.onSources(data.sources)
            } else if (data.token) {
              callbacks.onToken(data.token)
            }
          } catch {
            // Ignore parse errors for incomplete SSE chunks
          }
        }
      }
    }
    callbacks.onComplete()
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)))
  }
}
