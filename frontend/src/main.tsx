import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { ThemeProvider } from './hooks/useTheme'
import { SettingsProvider } from './hooks/useSettings'
import { ChatProvider } from './hooks/useChat'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <ChatProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChatProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
