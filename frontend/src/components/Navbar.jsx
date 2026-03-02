import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import './Navbar.css'

function Navbar() {
    const { user, logout } = useAuth()
    const { settings } = useSettings()

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span className="navbar-logo">🎋</span>
                <span className="navbar-title">EKANT</span>
            </div>

            <div className="navbar-links">
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🏠 Home</NavLink>
                {!settings?.digitalSilenceMode && (
                    <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>🏆 Leaderboard</NavLink>
                )}
                <NavLink to="/journal" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>📖 Journal</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>👤 Profile</NavLink>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>⚙️ Settings</NavLink>
            </div>

            {/* User avatar + logout */}
            {user && (
                <div className="navbar-user">
                    {user.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt={user.displayName || 'User'}
                            className="navbar-avatar"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="navbar-avatar-fallback">
                            {(user.displayName || user.email || '?')[0].toUpperCase()}
                        </div>
                    )}
                    <button
                        className="navbar-logout btn btn-ghost"
                        onClick={logout}
                        title="Sign out"
                    >
                        Sign out
                    </button>
                </div>
            )}
        </nav>
    )
}

export default Navbar
