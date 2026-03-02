import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProvider } from './context/UserContext'
import { ThemeBackground } from './components/ThemeBackground'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Journal from './pages/Journal'
import FocusTimer from './pages/FocusTimer'
import Settings from './pages/Settings'
import MysteryPage from './pages/MysteryPage'
import Breathe from './pages/Breathe'
import OnboardingOverlay from './components/overlays/OnboardingOverlay'
import './index.css'

function AppInner() {
  const { settings } = useSettings()
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <ThemeBackground visible={settings.liveBg} selectedId={settings.selectedBg} />
      {user && <Navbar />}
      <OnboardingOverlay />
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Protected routes — all redirect to /login if not authenticated */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/focus" element={<ProtectedRoute><FocusTimer /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/mystery" element={<ProtectedRoute><MysteryPage /></ProtectedRoute>} />
        <Route path="/breathe" element={<ProtectedRoute><Breathe /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ThemeProvider>
          <SettingsProvider>
            <AppInner />
          </SettingsProvider>
        </ThemeProvider>
      </UserProvider>
    </AuthProvider>
  )
}

export default App
