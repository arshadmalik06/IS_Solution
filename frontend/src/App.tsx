import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-text-primary isolate">
      {/* Background Geometry */}
      <div className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {/* Tilted rectangle of a lighter shade at 45 degrees */}
        <div className="absolute -top-1/4 -right-1/4 w-[150%] md:w-[100%] h-[150%] bg-surface-elevated opacity-20 -rotate-45 transform origin-center mix-blend-screen" />
      </div>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
