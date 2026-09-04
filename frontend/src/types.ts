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

// Settings Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ToneType = 'balanced' | 'professional' | 'concise';
export type FontSize = 'small' | 'medium' | 'large';

export interface ChatPreferences {
  tone: ToneType;
  showSources: boolean;
  enterToSubmit: boolean;
}

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
}

export interface QuBISSettings {
  theme: ThemeMode;
  chatPreferences: ChatPreferences;
  accessibility: AccessibilitySettings;
}
