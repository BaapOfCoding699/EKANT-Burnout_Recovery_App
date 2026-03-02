// ─────────────────────────────────────────────────────────────────────────────
// AuthContext.jsx — Global authentication state for the whole app
// ─────────────────────────────────────────────────────────────────────────────
import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

// Create the context
const AuthContext = createContext(null)

// ─── Provider ────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)   // Firebase user object or null
    const [loading, setLoading] = useState(true)   // true while checking session

    // Subscribe to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        })
        return unsubscribe   // cleanup on unmount
    }, [])

    // ── Actions ──────────────────────────────────────────────────────────────
    async function loginWithGoogle() {
        try {
            await signInWithPopup(auth, googleProvider)
        } catch (err) {
            console.error('Google login error:', err)
            throw err
        }
    }

    async function logout() {
        try {
            await signOut(auth)
        } catch (err) {
            console.error('Logout error:', err)
        }
    }

    async function signUpWithEmail(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    async function loginWithEmail(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    // ─── Return Pack ──────────────────────────────────────────────────────────
    const value = { user, loading, loginWithGoogle, signUpWithEmail, loginWithEmail, logout }

    // Don't render children until we know the auth state (avoids flash)
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.1rem',
                color: '#4a7c59',
                gap: '0.75rem',
            }}>
                <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🌿</span>
                Loading EKANT...
            </div>
        )
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
