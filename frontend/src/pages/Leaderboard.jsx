import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'
import './Leaderboard.css'

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

function Leaderboard() {
    const { settings } = useSettings()
    const { user } = useAuth()
    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        // Query top 50 users by EXP
        const q = query(collection(db, 'users'), orderBy('exp', 'desc'), limit(50))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = []
            snapshot.forEach((doc) => {
                fetchedUsers.push({ id: doc.id, ...doc.data() })
            })
            setAllUsers(fetchedUsers)
        })

        return () => unsubscribe()
    }, [])

    if (settings?.digitalSilenceMode) {
        return (
            <div className="page pb-20">
                <div className="leaderboard-header slide-in-up" style={{ marginTop: '4rem' }}>
                    <h1>🔇 Digital Silence Active</h1>
                    <p>Gamification and leaderboards are currently hidden.</p>
                    <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>Focus purely on your own recovery tasks.</p>
                </div>
            </div>
        )
    }

    // Apply my privacy setting — if I chose to hide myself, filter me out
    // Also filter out any other users who set hideFromLeaderboard: true
    const visibleUsers = allUsers.filter(u => {
        const isMe = user && u.id === user.uid
        if (isMe && settings.hideFromLeaderboard) return false
        if (!isMe && u.hideFromLeaderboard) return false
        return true
    })

    // Assign rank, handle isMe tag, and apply privacy settings to my row
    const users = visibleUsers.map((u, index) => {
        const isMe = user && u.id === user.uid
        const baseUser = {
            ...u,
            rank: index + 1,
            isMe,
            avatar: u.photoURL ? <img src={u.photoURL} alt="avatar" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" /> : '🌿',
            name: u.name || 'Friend',
            exp: u.exp || 0,
            streak: u.streak || 0,
            shareJournal: u.shareJournal || false,
            latestJournal: u.latestJournal || ''
        }

        if (isMe) {
            return {
                ...baseUser,
                hideStreak: settings.hideStreak,
                showProof: settings.showProof,
                shareJournal: settings.shareJournal
            }
        }
        return baseUser
    })

    const topThree = users.slice(0, 3)

    return (
        <div className="page">
            <div className="lb-header">
                <h1>🏆 Recovery Leaderboard</h1>
                <p>Every step forward counts. Keep going.</p>
            </div>

            {/* Top 3 Podium */}
            <div className="podium">
                {topThree.map(user => (
                    <div key={user.rank} className={`podium-card card rank-${user.rank}`}>
                        <div className="podium-medal">{RANK_MEDALS[user.rank]}</div>
                        <div className="podium-avatar">{user.avatar}</div>
                        <div className="podium-name">
                            {user.name}
                            {user.isMe && <span className="you-tag">you</span>}
                        </div>
                        {user.shareJournal && user.latestJournal && (
                            <div style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-muted)', margin: '4px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                "{user.latestJournal}"
                            </div>
                        )}
                        <div className="podium-exp">⭐ {user.exp} EXP</div>
                        {!user.hideStreak && <div className="podium-streak">🔥 {user.streak} days</div>}
                        {/* Proof photo on podium */}
                        {user.showProof && user.proofUrl && (
                            <img src={user.proofUrl} alt="proof" className="podium-proof" />
                        )}
                    </div>
                ))}
            </div>

            {/* Full Table */}
            <div className="card lb-table">
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Player</th>
                            <th>Streak 🔥</th>
                            <th>EXP ⭐</th>
                            <th>Proof 📸</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.rank} className={user.isMe ? 'my-row' : ''}>
                                <td>{RANK_MEDALS[user.rank] || `#${user.rank}`}</td>
                                <td className="player-cell">
                                    <span className="player-avatar">{user.avatar}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div>
                                            {user.name}
                                            {user.isMe && <span className="you-tag">you</span>}
                                        </div>
                                        {user.shareJournal && user.latestJournal && (
                                            <div style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                "{user.latestJournal}"
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>{user.hideStreak ? '—' : `${user.streak} days`}</td>
                                <td>{user.exp}</td>
                                <td>
                                    {user.showProof && user.proofUrl
                                        ? <img src={user.proofUrl} alt="proof" className="table-proof" />
                                        : <span className="no-proof">—</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Leaderboard
