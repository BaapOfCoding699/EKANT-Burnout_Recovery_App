// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute.jsx — Redirects to /login if the user is not authenticated
// ─────────────────────────────────────────────────────────────────────────────
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user } = useAuth()

    if (!user) {
        // Not logged in — send to login page
        return <Navigate to="/login" replace />
    }

    // Logged in — render the page normally
    return children
}
