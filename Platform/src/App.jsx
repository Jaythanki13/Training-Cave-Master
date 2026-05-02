import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LearnerDashboard from './pages/LearnerDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import AdminPanel from './pages/AdminPanel'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/learner" element={<LearnerDashboard />} />
      <Route path="/trainer" element={<TrainerDashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
