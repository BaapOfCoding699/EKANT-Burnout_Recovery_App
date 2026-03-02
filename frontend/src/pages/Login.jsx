import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
    const { loginWithGoogle } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleGoogleLogin() {
        setError('')
        setLoading(true)
        try {
            await loginWithGoogle()
            // AuthContext will detect the user change → App.jsx redirects to /dashboard
        } catch (err) {
            setError('Google sign-in failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="login-page">
            <div className="login-bg-blur" />

            <div className="login-box card">

                {/* Logo + branding */}
                <div className="login-logo-wrap">
                    <span className="login-logo">🌿</span>
                    <div className="login-brand-text">
                        <h1 className="login-title">EKANT</h1>
                        <p className="login-subtitle">एकांत</p>
                    </div>
                </div>

                <p className="login-tagline">
                    Your burnout recovery journey starts here.
                </p>

                {/* Feature highlights */}
                <div className="login-features">
                    <div className="login-feature"><span>🌱</span> Daily recovery tasks</div>
                    <div className="login-feature"><span>🔥</span> Streak tracking</div>
                    <div className="login-feature"><span>🕵️</span> Mystery challenges</div>
                    <div className="login-feature"><span>⭐</span> EXP & level system</div>
                </div>

                {/* Google sign-in */}
                <button
                    className="btn btn-google"
                    id="google-login"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="login-spinner">⏳</span>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                    )}
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Error message */}
                {error && (
                    <div className="login-error">
                        ⚠️ {error}
                    </div>
                )}

                <p className="login-note">
                    No judgment. No pressure. Just recovery. 🌱
                </p>

                <p className="login-privacy">
                    By signing in you agree to keep this space safe and kind.
                </p>
            </div>
        </div>
    )
}
