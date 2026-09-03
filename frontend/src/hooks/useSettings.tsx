import React, { createContext, useContext, useState, useEffect } from 'react';
import type { QuBISSettings } from '../types';
import { useTheme } from './useTheme';

const defaultSettings: QuBISSettings = {
  theme: 'system',
  chatPreferences: {
    tone: 'balanced',
    model: 'gemini-pro',
    showSources: true,
    enterToSubmit: true,
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
  },
};

interface SettingsContextType {
  settings: QuBISSettings;
  updateSettings: (newSettings: Partial<QuBISSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<QuBISSettings>(() => {
    const saved = localStorage.getItem('qubis_settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem('qubis_settings', JSON.stringify(settings));
    
    // Apply accessibility settings to document
    const root = document.documentElement;
    
    // Font size
    root.setAttribute('data-font-size', settings.accessibility.fontSize);
    
    // High contrast
    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduce motion
    if (settings.accessibility.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Sync theme
    if (settings.theme !== 'system' && settings.theme !== theme) {
       if (settings.theme === 'light' && theme === 'dark') toggleTheme();
       if (settings.theme === 'dark' && theme === 'light') toggleTheme();
    }
    
  }, [settings, theme, toggleTheme]);

  const updateSettings = (newSettings: Partial<QuBISSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      chatPreferences: {
        ...prev.chatPreferences,
        ...(newSettings.chatPreferences || {}),
      },
      accessibility: {
        ...prev.accessibility,
        ...(newSettings.accessibility || {}),
      },
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
