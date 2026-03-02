import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MYSTERIES } from '../data/tasks'
import './MysteryPage.css'

const DIFFICULTY_ORDER = ['Beginner Detective', 'Intermediate Detective', 'Advanced Detective']

export default function MysteryPage() {
    const navigate = useNavigate()

    // null means show selection screen, otherwise the mystery object
    const [selectedMystery, setSelectedMystery] = useState(null)
    const [filterDiff, setFilterDiff] = useState('All')

    const [phase, setPhase] = useState('intro')
    const [chapterIndex, setChapterIndex] = useState(0)
    const [userAnswer, setUserAnswer] = useState('')
    const [solved, setSolved] = useState(false)

    const mystery = selectedMystery
    const chapter = mystery ? mystery.chapters[chapterIndex] : null
    const isLastChap = mystery ? chapterIndex >= mystery.chapters.length - 1 : false

    function selectMystery(m) {
        setSelectedMystery(m)
        setPhase('intro')
        setChapterIndex(0)
        setUserAnswer('')
        setSolved(false)
    }

    function backToList() {
        setSelectedMystery(null)
        setPhase('intro')
    }

    function startMystery() { setPhase('story') }

    function nextChapter() {
        if (isLastChap) {
            setPhase('reveal')
        } else {
            setChapterIndex(i => i + 1)
        }
    }

    function submitAnswer() {
        if (userAnswer.trim().length < 5) return
        setSolved(true)
    }

    const filteredMysteries = filterDiff === 'All'
        ? MYSTERIES
        : MYSTERIES.filter(m => m.difficulty === filterDiff)

    // ── SELECTION SCREEN ───────────────────────────────────────────────────────
    if (!selectedMystery) {
        return (
            <div className="mystery-page page">
                <button className="mystery-back btn btn-ghost" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>

                <div className="mystery-list-header slide-in-up">
                    <div style={{ fontSize: '2.5rem' }}>🕵️</div>
                    <h1 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1.8rem' }}>Mystery Vault</h1>
                    <p style={{ margin: 0, opacity: 0.75 }}>{MYSTERIES.length} mysteries to solve — pick your challenge</p>
                </div>

                {/* Difficulty filter pills */}
                <div className="mystery-filter-row slide-in-up">
                    {['All', ...DIFFICULTY_ORDER].map(d => (
                        <button
                            key={d}
                            className={`mystery-filter-pill ${filterDiff === d ? 'active' : ''}`}
                            onClick={() => setFilterDiff(d)}
                        >
                            {d === 'All' ? '🌟 All' : d === 'Beginner Detective' ? '🟢 Beginner' : d === 'Intermediate Detective' ? '🟡 Intermediate' : '🔴 Advanced'}
                        </button>
                    ))}
                </div>

                <div className="mystery-grid slide-in-up">
                    {filteredMysteries.map(m => (
                        <button
                            key={m.id}
                            className="mystery-list-card"
                            onClick={() => selectMystery(m)}
                        >
                            <span className="mystery-list-emoji">{m.coverEmoji}</span>
                            <div className="mystery-list-info">
                                <div className="mystery-list-title">{m.title}</div>
                                <div className="mystery-list-subtitle">{m.subtitle}</div>
                                <div className="mystery-list-meta">
                                    <span className={`mystery-diff-badge diff-${m.difficulty.split(' ')[0].toLowerCase()}`}>
                                        {m.difficulty === 'Beginner Detective' ? '🟢' : m.difficulty === 'Intermediate Detective' ? '🟡' : '🔴'} {m.difficulty}
                                    </span>
                                    <span className="mystery-list-time">🕐 {m.timeEstimate}</span>
                                </div>
                            </div>
                            <span className="mystery-list-arrow">→</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    // ── MYSTERY FLOW ───────────────────────────────────────────────────────────
    return (
        <div className="mystery-page page">

            {/* Back button */}
            <button className="mystery-back btn btn-ghost" onClick={backToList}>
                ← All Mysteries
            </button>

            {/* ── INTRO SCREEN ─────────────────────────────────────────── */}
            {phase === 'intro' && (
                <div className="mystery-intro card slide-in-up">
                    <div className="mystery-cover-emoji">{mystery.coverEmoji}</div>
                    <div className="mystery-badge">{mystery.difficulty}</div>
                    <h1 className="mystery-title">{mystery.title}</h1>
                    <p className="mystery-subtitle">{mystery.subtitle}</p>

                    <div className="mystery-info-row">
                        <span>🕐 {mystery.timeEstimate}</span>
                        <span>⭐ +20 EXP on completion</span>
                    </div>

                    <div className="mystery-setting">
                        <h3>🗺️ The Setting</h3>
                        <p>{mystery.setting}</p>
                    </div>

                    <h3 style={{ margin: '1.5rem 0 1rem' }}>🧑‍🤝‍🧑 The Characters</h3>
                    <div className="mystery-characters">
                        {mystery.characters.map(c => (
                            <div key={c.name} className="mystery-char-card">
                                <span className="char-emoji">{c.emoji}</span>
                                <div>
                                    <div className="char-name">{c.name}</div>
                                    <div className="char-role">{c.role}</div>
                                    <div className="char-desc">{c.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-primary mystery-start-btn" onClick={startMystery}>
                        🕵️ Start Investigating →
                    </button>
                </div>
            )}

            {/* ── STORY / CHAPTERS ─────────────────────────────────────── */}
            {phase === 'story' && chapter && (
                <div className="mystery-chapter card slide-in-up" key={chapterIndex}>
                    {/* Progress bar */}
                    <div className="mystery-progress">
                        {mystery.chapters.map((_, i) => (
                            <div
                                key={i}
                                className={`mystery-progress-dot ${i <= chapterIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    <div className="chapter-day-badge">{chapter.day}</div>
                    <h2 className="chapter-heading">{chapter.heading}</h2>

                    {/* Story text — multi-paragraph */}
                    <div className="chapter-story">
                        {chapter.story.split('\n\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>

                    {/* Clue box */}
                    <div className="clue-box">
                        <div className="clue-header">
                            <span className="clue-emoji">{chapter.clue.emoji}</span>
                            <span className="clue-label">🔍 New Clue Discovered</span>
                        </div>
                        <p className="clue-text">{chapter.clue.text}</p>
                    </div>

                    {/* Thought prompt */}
                    <div className="thought-prompt">
                        <span className="thought-icon">💭</span>
                        <p>{chapter.thought}</p>
                    </div>

                    <button className="btn btn-primary chapter-next-btn" onClick={nextChapter}>
                        {isLastChap ? '🕵️ I have all the clues — reveal the answer' : 'Next Day →'}
                    </button>
                </div>
            )}

            {/* ── REVEAL SCREEN ────────────────────────────────────────── */}
            {phase === 'reveal' && (
                <div className="mystery-reveal card slide-in-up">
                    <div className="mystery-reveal-header">
                        <span style={{ fontSize: '2.5rem' }}>🕵️</span>
                        <h2>The Detective&apos;s Verdict</h2>
                        <p className="mystery-question">{mystery.finalQuestion}</p>
                    </div>

                    {!solved ? (
                        <div className="mystery-answer-form">
                            <label className="answer-label">Your Answer:</label>
                            <textarea
                                className="answer-input"
                                placeholder="Write who did it, how they did it, and why... Take your time."
                                value={userAnswer}
                                onChange={e => setUserAnswer(e.target.value)}
                                rows={5}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={submitAnswer}
                                disabled={userAnswer.trim().length < 5}
                            >
                                🔍 Submit My Theory
                            </button>
                        </div>
                    ) : (
                        <div className="mystery-solution">
                            <div className="solution-verdict">
                                <span className="verdict-emoji">✅</span>
                                <strong>The Truth</strong>
                            </div>
                            <p className="solution-short">{mystery.answer.shortVersion}</p>
                            <div className="solution-divider">— Full Reveal —</div>
                            <div className="solution-full">
                                {mystery.answer.fullReveal.split('\n\n').map((para, i) => (
                                    <p key={i}>{para}</p>
                                ))}
                            </div>
                            <div className="mystery-complete-row">
                                <div className="mystery-exp-badge">+20 EXP earned! 🎉</div>
                                <button className="btn btn-ghost" onClick={backToList}>
                                    ← Try Another Mystery
                                </button>
                                <button className="btn btn-primary" onClick={() => navigate('/')}>
                                    ← Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}
