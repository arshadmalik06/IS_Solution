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
    const saved = localStorage.getItem('bis-theme')
    if (saved === 'light' || saved === 'dark') {
      return saved as ThemeMode
    }
    // Check settings storage as fallback
    const settingsSaved = localStorage.getItem('qubis_settings')
    if (settingsSaved) {
      try {
        const parsed = JSON.parse(settingsSaved)
        if (parsed.theme === 'light' || parsed.theme === 'dark') return parsed.theme
      } catch (e) {}
    }
    // Default to dark
    return 'dark'
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
    setThemeState(prev => {
      if (prev === 'system') {
        // Resolve system to its effective value, then flip
        const effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        return effective === 'dark' ? 'light' : 'dark'
      }
      return prev === 'dark' ? 'light' : 'dark'
    })
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
