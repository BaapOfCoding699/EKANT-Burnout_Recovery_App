import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import './Profile.css'
const LEVEL_TITLES = [
    'Seedling 🌱', 'Sprout 🌿', 'Sapling 🌳', 'Grove 🏕️', 'Forest 🌲',
    'Elder Tree 🌳', 'Ancient Forest 🏔️', 'Zenith 🌟',
]

function getLevelTitle(level) {
    return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)]
}

function Profile() {
    const { user } = useAuth()
    const { userData } = useUser()

    if (!user || !userData) return null

    const exp = userData.exp || 0
    const level = Math.floor(exp / 50) + 1
    const expToNext = level * 50
    const expProgress = Math.round((exp / expToNext) * 100)

    // Calculate days active since joinedAt
    let joinedDays = 0
    if (userData.joinedAt) {
        // joinedAt can be a Firestore Timestamp { seconds, nanoseconds } or Date
        const joinedDate = userData.joinedAt.toDate ? userData.joinedAt.toDate() : new Date()
        const diffTime = Math.abs(new Date() - joinedDate)
        joinedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    const hobbies = ['Painting', 'Running'] // To be dynamic later

    return (
        <div className="page">
            {/* Profile Card */}
            <div className="card profile-hero">
                <div className="profile-avatar">
                    {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : '🌿'}
                </div>
                <div className="profile-info">
                    <h1>{user.displayName || 'Friend'}</h1>
                    <p className="level-title">{getLevelTitle(level)}</p>
                    <div className="profile-badges">
                        <span className="badge badge-streak">🔥 {userData.streak} day streak</span>
                        <span className="badge badge-exp">⭐ {exp} EXP</span>
                    </div>
                </div>
            </div>

            {/* EXP Progress */}
            <div className="card exp-card">
                <div className="exp-header">
                    <span>Level {level} → Level {level + 1}</span>
                    <span>{exp} / {expToNext} EXP</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${expProgress}%` }} />
                </div>
                <p className="exp-hint">{expToNext - exp} EXP to next level</p>
            </div>

            {/* Stats Row */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-value">{userData.totalTasks || 0}</div>
                    <div className="stat-label">Tasks Done</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon">🔥</div>
                    <div className="stat-value">{userData.streak}</div>
                    <div className="stat-label">Day Streak</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon">📅</div>
                    <div className="stat-value">{joinedDays}</div>
                    <div className="stat-label">Days Active</div>
                </div>
            </div>

            {/* Hobbies */}
            <div className="card hobbies-card">
                <h3>My Recovery Hobbies</h3>
                <div className="hobbies-list">
                    {hobbies.map(h => (
                        <span key={h} className="hobby-tag">{h}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Profile
