import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LearnerDashboard from './pages/LearnerDashboard'
import TrainerDashboard from './pages/TrainerDashboard'
import AdminPanel from './pages/AdminPanel'
import TrainerProfile from './pages/TrainerProfile'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

// Redirects logged-in users away from the landing page to their dashboard
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to={dashboardFor(user.role)} replace />
  return children
}

// Blocks unauthenticated users; optionally restricts by role
function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/" replace />
  if (role && user.role !== role) return <Navigate to={dashboardFor(user.role)} replace />
  return children
}

function dashboardFor(role) {
  if (role === 'trainer') return '/trainer'
  if (role === 'super_admin') return '/admin'
  return '/learner'
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/learner" element={<ProtectedRoute role="learner"><LearnerDashboard /></ProtectedRoute>} />
        <Route path="/trainer" element={<ProtectedRoute role="trainer"><TrainerDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="super_admin"><AdminPanel /></ProtectedRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/trainers/:id" element={<TrainerProfile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
