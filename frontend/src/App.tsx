import { Routes, Route, Navigate } from 'react-router-dom'
import AssistantPage from './pages/AssistantPage'
import StandardsPage from './pages/StandardsPage'
import LabsPage from './pages/LabsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AssistantPage />} />
      <Route path="/standards" element={<StandardsPage />} />
      <Route path="/labs" element={<LabsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
