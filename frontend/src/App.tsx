import { Routes, Route, Navigate } from 'react-router-dom'
import AssistantPage from './pages/AssistantPage'
import ChecklistPage from './pages/ChecklistPage'
import StandardsPage from './pages/StandardsPage'
import LabsPage from './pages/LabsPage'
import { SettingsPage } from './pages/SettingsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AssistantPage />} />
      <Route path="/checklist" element={<ChecklistPage />} />
      <Route path="/standards" element={<StandardsPage />} />
      <Route path="/labs" element={<LabsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
