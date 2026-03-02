import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TIERS, TASKS } from '../data/tasks'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../context/UserContext'
import { useSettings } from '../context/SettingsContext'
import TaskCard from '../components/TaskCard'
import './Dashboard.css'


const KNOWLEDGE_CARDS = [
    { icon: '🌊', tag: 'Science', text: "The ocean produces over 50% of the world's oxygen — more than all the forests combined." },
    { icon: '🧠', tag: 'Psychology', text: 'It takes about 66 days to form a new habit, not 21. But every small step still counts.' },
    { icon: '🐙', tag: 'Nature', text: 'Octopuses have three hearts, and two stop beating when they swim.' },
    { icon: '😂', tag: 'Fun Fact', text: 'A group of flamingos is called a flamboyance. Absolutely accurate.' },
    { icon: '💡', tag: 'Creativity', text: 'Your best ideas still come in the shower. Science agrees.' },
    { icon: '🌍', tag: 'Geography', text: 'There are more trees on Earth than stars in the Milky Way — over 3 trillion!' },
    { icon: '😴', tag: 'Health', text: "You can't fully catch up on sleep. Losing it has real effects." },
    { icon: '🎵', tag: 'Music', text: 'Listening to music you love releases dopamine — same chemical as food and love.' },
    { icon: '🐝', tag: 'Nature', text: 'Bees pollinate 1/3 of everything we eat. They matter more than most.' },
    { icon: '🤔', tag: 'Philosophy', text: 'The obstacle is the way. — Marcus Aurelius.' },
    { icon: '🏔️', tag: 'Adventure', text: 'Mount Everest grows about 4mm taller every year due to tectonic movement.' },
    { icon: '❤️', tag: 'Kindness', text: 'Acts of kindness are contagious. Witnessing kindness makes observers more kind too.' },
]

const RECOVERY_SUGGESTIONS = [
    { icon: '🏛️', tag: 'Architecture', text: "Read about Neoclassical architecture — the revival of classical Greek and Roman symmetry and simplicity." },
    { icon: '🧠', tag: 'Metaphilosophy', text: "Explore Metaphilosophy: What is the true nature, aim, and method of philosophy itself?" },
    { icon: '🗺️', tag: 'Cartography', text: "Discover Cartography — the ancient art and science of map-making and representing reality." },
    { icon: '⚙️', tag: 'Engineering', text: "Study Gun Anatomy — understanding the complex mechanical engineering and physics of firearms." },
    { icon: '🌀', tag: 'Psychology', text: "Read about Hypnosis — the therapeutic induction of highly focused attention and heightened suggestibility." },
    { icon: '✨', tag: 'Esoteric', text: "Explore Astral Projection — an intentional out-of-body experience (OBE) that assumes the existence of a subtle body." },
    { icon: '🎭', tag: 'Expression', text: "Learn about Psychological Expression — how micro-expressions reveal hidden human emotions." },
    { icon: '🚩', tag: 'Vexillology', text: "Dive into the History of Flags — how colors, crests, and symbols shaped the identities of nations." },
    { icon: '0️⃣', tag: 'Mathematics', text: "Read about the Invention of Zero — how ancient Indian mathematicians revolutionized global mathematics." },
    { icon: '🕉️', tag: 'Spirituality', text: "Explore Buddhism — the Four Noble Truths and the path to ending the cycle of suffering (Samsara)." },
    { icon: '📜', tag: 'Literature', text: "Read War Poetry — understanding the brutal realism and emotional depth of WWI and WWII poets." },
    { icon: '🏨', tag: 'Industry', text: "Look into the BTS of the Hospitality Industry — the precise choreography behind 5-star hotel operations." },
    { icon: '🏭', tag: 'Labor', text: "Read about the Employee Experience of Foxconn — the intense realities of global mega-manufacturing." },
    { icon: '☸️', tag: 'Dharma', text: "Study Sanatan Dharma — the eternal order, duties, and practices underlying Hinduism." },
    { icon: '🐍', tag: 'Yoga', text: "Learn about Kundalini Yoga — the awakening of primal energy located at the base of the spine." },
    { icon: '🎵', tag: 'Song', text: "Listen: 'Weightless' by Marconi Union (Scientifically proven to reduce anxiety by 65%)", link: "https://www.youtube.com/watch?v=UfcAVejslrU" },
    { icon: '🎧', tag: 'Zen', text: "Listen: Lo-Fi Japanese Zen Music (Lowers cortisol and increases focus)", link: "https://www.youtube.com/watch?v=5qap5aO4i9A" }
]

function Dashboard() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { userData, addExp, logScreenTime, screenTimeLogs } = useUser()
    const { settings } = useSettings()

    // Get first name from custom userData name or Google auth, fallback to 'friend'
    const firstName = (userData?.name || user?.displayName || 'friend').split(' ')[0]

    const [selectedTier, setSelectedTier] = useState(null)   // null = tier picker shown
    const [taskIndex, setTaskIndex] = useState(0)
    const [proofFile, setProofFile] = useState(null)
    const [proofPreview, setProofPreview] = useState(null)
    const [experienceText, setExperienceText] = useState('')
    const [completed, setCompleted] = useState(false)
    const [celebrating, setCelebrating] = useState(false)
    const [lastGain, setLastGain] = useState(0)
    const [totalToday, setTotalToday] = useState(0)

    // Screen Time State
    const [screenHours, setScreenHours] = useState('')
    const [screenMinutes, setScreenMinutes] = useState('')
    const [screenLogged, setScreenLogged] = useState(false)

    // Check if they already logged screen time today
    useEffect(() => {
        if (!screenTimeLogs || screenTimeLogs.length === 0) return

        const now = new Date()
        const offset = now.getTimezoneOffset() * 60000
        const todayStr = new Date(now - offset).toISOString().split('T')[0]

        // Logs are stored with ID = YYYY-MM-DD
        const hasLoggedToday = screenTimeLogs.some(log => log.id === todayStr)
        if (hasLoggedToday) {
            setScreenLogged(true)
        }
    }, [screenTimeLogs])

    const todayFact = useMemo(() =>
        KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)], [])

    const todaySuggestion = useMemo(() =>
        RECOVERY_SUGGESTIONS[Math.floor(Math.random() * RECOVERY_SUGGESTIONS.length)], [])

    // When switching tiers, reset task progression
    function handleSelectTier(tierId) {
        setSelectedTier(tierId)
        setTaskIndex(0)
        setCompleted(false)
        setProofFile(null)
        setProofPreview(null)
        setExperienceText('')
    }

    // If Mystery tier selected, navigate to mystery page
    function handleTierClick(tier) {
        if (tier.id === 'mystery') {
            navigate('/mystery')
            return
        }
        handleSelectTier(tier.id)
    }

    const currentTierTasks = selectedTier ? TASKS[selectedTier] : []
    const currentTask = currentTierTasks[taskIndex]
    const isLastTask = taskIndex >= currentTierTasks.length - 1
    const tierConfig = TIERS.find(t => t.id === selectedTier)

    function handleComplete() {
        const base = tierConfig?.exp || 5
        const gain = proofFile ? base + 5 : base
        setLastGain(gain)
        setTotalToday(n => n + gain)
        setCelebrating(true)

        // Write to Firestore!
        addExp(gain, {
            taskId: currentTask.id || currentTask.title,
            title: currentTask.title,
            category: currentTask.category,
            experienceText: experienceText.trim(),
            hasProof: !!proofFile,
        })

        setTimeout(() => { setCelebrating(false); setCompleted(true) }, 1100)
    }

    function handleNextTask() {
        setCompleted(false)
        setProofFile(null)
        setProofPreview(null)
        setExperienceText('')
        setTaskIndex(i => i + 1)
    }

    function handleChangeTier() {
        setSelectedTier(null)
        setTaskIndex(0)
        setCompleted(false)
    }

    async function handleScreenTimeSubmit(e) {
        e.preventDefault()
        if (!screenHours && !screenMinutes) return
        await logScreenTime(screenHours || 0, screenMinutes || 0)
        setScreenLogged(true)
        addExp(2, {
            taskId: 'screen-time-log',
            title: 'Logged Screen Time',
            category: 'Habit',
            experienceText: `Logged ${screenHours || 0}h ${screenMinutes || 0}m.`,
            hasProof: false
        })
    }

    return (
        <div className="page">

            {/* Header */}
            <div className="dash-header slide-in-up">
                <div>
                    <h1 className="dash-greeting">Hey, {firstName} 👋</h1>
                    <p className="dash-sub">
                        {!selectedTier
                            ? 'Choose your focus for today.'
                            : `${tierConfig?.icon} ${tierConfig?.label} mode — task ${taskIndex + 1} of ${currentTierTasks.length}`}
                    </p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-ghost"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                            onClick={() => navigate('/focus')}
                        >
                            🧘 Enter Zen Mode
                        </button>
                        <button
                            className="btn btn-ghost"
                            style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                            onClick={() => navigate('/breathe')}
                        >
                            🪷 Breathing Guide
                        </button>
                    </div>
                </div>
                {!settings?.digitalSilenceMode && (
                    <div className="stat-pills">
                        <span className="stat-pill">🔥 <strong>{userData?.streak || 0}</strong> streak</span>
                        <span className="stat-pill exp-pill">⭐ <strong>{userData?.exp || 0}</strong> EXP</span>
                        {totalToday > 0 && <span className="stat-pill today-pill">+{totalToday} today</span>}
                    </div>
                )}
            </div>

            {/* Daily Spark Card */}
            <div className="knowledge-card card slide-in-up" style={{ animationDelay: '60ms' }}>
                <div className="knowledge-top">
                    <span className="knowledge-icon">{todayFact.icon}</span>
                    <span className="knowledge-tag">{todayFact.tag}</span>
                    <span className="knowledge-refresh">✨ Today&apos;s spark</span>
                </div>
                <p className="knowledge-text">{todayFact.text}</p>
            </div>

            {/* Recovery Suggestion Box */}
            <div className="suggestion-card card slide-in-up" style={{ animationDelay: '90ms' }}>
                <div className="suggestion-top">
                    <span className="suggestion-icon">{todaySuggestion.icon}</span>
                    <span className="suggestion-tag">{todaySuggestion.tag}</span>
                    <span className="suggestion-refresh">💡 Recovery Suggestion</span>
                </div>
                <p className="suggestion-text">{todaySuggestion.text}</p>
                {todaySuggestion.link && (
                    <a href={todaySuggestion.link} target="_blank" rel="noreferrer" className="btn btn-primary suggestion-btn">
                        Open Link ↗
                    </a>
                )}
            </div>

            {/* Daily Screen Time Check-in */}
            {!screenLogged && (
                <div className="card slide-in-up" style={{ animationDelay: '100ms', marginBottom: '2rem' }}>
                    <div className="suggestion-top" style={{ marginBottom: '1rem' }}>
                        <span className="suggestion-icon">📱</span>
                        <span className="suggestion-refresh" style={{ color: 'var(--text-color)', fontWeight: '600' }}>Daily Screen Time Check-in</span>
                    </div>
                    <form onSubmit={handleScreenTimeSubmit} className="screen-time-form">
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            Awareness is the first step to recovery. How much time did you spend on your phone today?
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                            <input
                                type="number"
                                min="0" max="24"
                                placeholder="hrs"
                                value={screenHours}
                                onChange={e => setScreenHours(e.target.value)}
                                style={{ width: '70px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.5)' }}
                            />
                            <span>h</span>
                            <input
                                type="number"
                                min="0" max="59"
                                placeholder="min"
                                value={screenMinutes}
                                onChange={e => setScreenMinutes(e.target.value)}
                                style={{ width: '70px', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.5)' }}
                            />
                            <span>m</span>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Log Screen Time (+2 EXP)
                        </button>
                    </form>
                </div>
            )}

            {/* ── TIER PICKER (when no tier selected) ─────────────────── */}
            {!selectedTier && (
                <div className="tier-picker slide-in-up" style={{ animationDelay: '120ms' }}>
                    <p className="tier-picker-label">What do you want to work on today?</p>
                    <div className="tier-grid">
                        {TIERS.map(tier => (
                            <button
                                key={tier.id}
                                className={`tier-card ${tier.dark ? 'tier-card-dark' : ''}`}
                                style={{
                                    '--tier-color': tier.color,
                                    '--tier-bg': tier.bg,
                                    '--tier-border': tier.border,
                                }}
                                onClick={() => handleTierClick(tier)}
                            >
                                <span className="tier-card-icon">{tier.icon}</span>
                                <div className="tier-card-info">
                                    <span className="tier-card-label">{tier.label}</span>
                                    <span className="tier-card-tagline">{tier.tagline}</span>
                                </div>
                                <span className="tier-card-exp">+{tier.exp} EXP</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TASK CARD (when tier selected) ──────────────────────── */}
            {selectedTier && currentTask && (
                <TaskCard
                    key={`${selectedTier}-${taskIndex}`}
                    task={currentTask}
                    tierConfig={tierConfig}
                    proofFile={proofFile}
                    proofPreview={proofPreview}
                    experienceText={experienceText}
                    setExperienceText={setExperienceText}
                    completed={completed}
                    celebrating={celebrating}
                    lastGain={lastGain}
                    isLastTask={isLastTask}
                    onComplete={handleComplete}
                    onNextTask={handleNextTask}
                    onChangeTier={handleChangeTier}
                    setProofFile={setProofFile}
                    setProofPreview={setProofPreview}
                />
            )}

            {/* All done for this tier */}
            {selectedTier && !currentTask && (
                <div className="card all-done-card slide-in-up">
                    <div className="done-emoji" style={{ fontSize: '3rem' }}>🌿</div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Section complete!</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                        You finished all {currentTierTasks.length} {tierConfig?.label} tasks. That is a real win.
                    </p>
                    <button className="btn btn-primary" onClick={handleChangeTier}>
                        Try another section
                    </button>
                </div>
            )}

        </div>
    )
}

export default Dashboard
