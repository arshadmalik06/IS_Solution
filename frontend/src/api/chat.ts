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

    if (!response.ok) throw new Error(`Chat API Error: ${response.status}`)
    if (!response.body) throw new Error('No readable stream available.')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      
      // 1. EXTRACT PDF METADATA (filename, page, and the clause anchor phrase)
      if (buffer.includes('"filename"')) {
        const fileMatch = buffer.match(/"filename"\s*:\s*"([^"]+)"/)
        const pageMatch = buffer.match(/"page_number"\s*:\s*(\d+)/)

        if (fileMatch && pageMatch) {
          const searchMatch = buffer.match(/"search"\s*:\s*"((?:[^"\\]|\\.)*)"/)
          const clauseMatch = buffer.match(/"clause_id"\s*:\s*"([^"]*)"/)
          const stdMatch = buffer.match(/"standard_id"\s*:\s*"([^"]*)"/)
          const unescape = (s: string) =>
            s.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
             .replace(/\\(["\\/])/g, '$1')

          callbacks.onSources([{
            metadata: {
              filename: fileMatch[1],
              page_number: parseInt(pageMatch[1], 10),
              search: searchMatch ? unescape(searchMatch[1]) : undefined,
              clause_id: clauseMatch ? clauseMatch[1] : undefined,
              standard_id: stdMatch ? stdMatch[1] : undefined,
            },
          } as any])
          buffer = buffer.replace(/"filename"\s*:\s*"[^"]+"/, '')
        }
      }

      // 2. EXTRACT TEXT TOKENS (With bulletproof decoding)
      const tokenRegex = /"token"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g
      let match
      let lastIndex = 0
      
      while ((match = tokenRegex.exec(buffer)) !== null) {
        let token = match[1];

        // Decodes both double-escaped (\\u) and single-escaped (\u) Unicode instantly
        token = token.replace(/(?:\\\\|\\)u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        
        // FIX: Matches ANY number of backslashes followed by 'n' and turns them into a single clean line break
        token = token.replace(/\\+n/g, '\n');
        
        // Clean up tabs and quotes
        token = token.replace(/\\+t/g, '\t');
        token = token.replace(/\\+"/g, '"');
        
        // Failsafe: Strips any leftover stray backslashes sitting in front of special symbols like ° or ±
        token = token.replace(/\\+([°±])/g, '$1');
        
        // Catch any remaining random double backslashes
        token = token.replace(/\\\\/g, '');

        callbacks.onToken(token)
        
        lastIndex = match.index + match[0].length
      }
      
      if (lastIndex > 0) {
        buffer = buffer.substring(lastIndex)
      }
    }
    
    callbacks.onComplete()
  } catch (error) {
    callbacks.onError(error instanceof Error ? error : new Error(String(error)))
  }
}