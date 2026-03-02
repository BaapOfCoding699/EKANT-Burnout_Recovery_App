import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './Journal.css'

function Journal() {
    const { user } = useAuth()
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const q = query(
            collection(db, `users/${user.uid}/taskLogs`),
            orderBy('timestamp', 'desc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedLogs = []
            snapshot.forEach((doc) => {
                fetchedLogs.push({ id: doc.id, ...doc.data() })
            })
            setLogs(fetchedLogs)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    // Format timestamp
    function formatDate(timestamp) {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date)
    }

    return (
        <div className="page journal-page">
            <div className="journal-header slide-in-up">
                <h1>📖 Reflection Journal</h1>
                <p>Your thoughts and feelings across your recovery journey.</p>
            </div>

            {loading ? (
                <div className="journal-loading slide-in-up" style={{ animationDelay: '100ms' }}>
                    Loading entries...
                </div>
            ) : logs.length === 0 ? (
                <div className="journal-empty slide-in-up" style={{ animationDelay: '100ms' }}>
                    <div className="empty-emoji">📝</div>
                    <h3>Your journal is empty</h3>
                    <p>Complete tasks and write about your experience to fill your journal.</p>
                </div>
            ) : (
                <div className="journal-grid">
                    {logs.map((log, index) => (
                        <div
                            key={log.id}
                            className="card journal-card slide-in-up"
                            style={{ animationDelay: `${100 + (index * 40)}ms` }}
                        >
                            <div className="journal-card-top">
                                <span className="journal-task-title">{log.title || 'Task Completed'}</span>
                                <span className="journal-date">{formatDate(log.timestamp)}</span>
                            </div>

                            {log.category && (
                                <span className={`category-badge cat-${log.category.toLowerCase()}`}>
                                    {log.category}
                                </span>
                            )}

                            {log.experienceText ? (
                                <p className="journal-text">"{log.experienceText}"</p>
                            ) : (
                                <p className="journal-text empty-text">No reflection written for this task.</p>
                            )}

                            {log.hasProof && (
                                <div className="journal-proof-badge">📸 Photo Proof Attached</div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Journal
