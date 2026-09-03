import { createContext, useContext, useEffect, useState } from 'react'
import type { ThemeMode } from '../types'

interface ThemeContextType {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check local storage first (from old implementation or settings)
    const settingsSaved = localStorage.getItem('qubis_settings')
    if (settingsSaved) {
      try {
        const parsed = JSON.parse(settingsSaved)
        if (parsed.theme) return parsed.theme
      } catch (e) {}
    }
    const saved = localStorage.getItem('bis-theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved as ThemeMode
    }
    // Default to system
    return 'system'
  })

  useEffect(() => {
    localStorage.setItem('bis-theme', theme)
    
    let activeTheme = theme;
    if (theme === 'system') {
      activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (activeTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light')
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);

  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
