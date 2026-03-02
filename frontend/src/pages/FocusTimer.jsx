import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import './FocusTimer.css'

const PRESETS = [
    { label: '5 min', seconds: 5 * 60 },
    { label: '10 min', seconds: 10 * 60 },
    { label: '25 min', seconds: 25 * 60 },
]

export default function FocusTimer() {
    const navigate = useNavigate()
    const { addExp } = useUser()

    const [timeLeft, setTimeLeft] = useState(PRESETS[0].seconds)
    const [initialTime, setInitialTime] = useState(PRESETS[0].seconds)
    const [isActive, setIsActive] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const intervalRef = useRef(null)

    // Lock body scroll when in Zen Mode
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            handleComplete()
        }

        return () => clearInterval(intervalRef.current)
    }, [isActive, timeLeft])

    function handleComplete() {
        setIsActive(false)
        setIsFinished(true)
        clearInterval(intervalRef.current)

        // Reward EXP based on minutes focused (1 EXP per minute)
        const minutesFocused = Math.floor(initialTime / 60)
        if (minutesFocused > 0) {
            addExp(minutesFocused, {
                taskId: 'focus-session',
                title: `${minutesFocused}m Focus Session`,
                category: 'Wellness',
                experienceText: 'Completed a deep focus session.',
                hasProof: false
            })
        }
    }

    function toggleTimer() {
        setIsActive(!isActive)
    }

    function resetTimer() {
        setIsActive(false)
        setTimeLeft(initialTime)
        setIsFinished(false)
    }

    function setPreset(seconds) {
        setIsActive(false)
        setIsFinished(false)
        setInitialTime(seconds)
        setTimeLeft(seconds)
    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    // Calculate stroke dashoffset for the SVG ring
    const radius = 120
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (timeLeft / initialTime) * circumference

    return (
        <div className="focus-timer-page">
            <button className="btn btn-ghost exit-zen-btn" onClick={() => navigate('/dashboard')}>
                &larr; Exit Zen Mode
            </button>

            <div className="zen-container slide-in-up">
                <h1 className="zen-title">Deep Focus</h1>
                <p className="zen-subtitle">No scrolling. No distractions. Just breathe.</p>

                {/* SVG Timer Ring */}
                <div className="timer-wrapper">
                    <svg className="timer-svg" width="300" height="300" viewBox="0 0 300 300">
                        {/* Background ring */}
                        <circle
                            className="timer-ring-bg"
                            cx="150" cy="150" r={radius}
                            strokeWidth="8"
                        />
                        {/* Progress ring */}
                        <circle
                            className="timer-ring-progress"
                            cx="150" cy="150" r={radius}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 150 150)"
                        />
                    </svg>

                    <div className="timer-display">
                        <span className="time-text">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                <div className="timer-controls">
                    {!isFinished ? (
                        <>
                            <button className="btn btn-primary btn-large toggle-btn" onClick={toggleTimer}>
                                {isActive ? 'Pause' : 'Start'}
                            </button>
                            <button className="btn btn-ghost reset-btn" onClick={resetTimer}>
                                Reset
                            </button>
                        </>
                    ) : (
                        <div className="session-complete slide-in-up">
                            <h2>Session Complete 🌿</h2>
                            <p>+{Math.floor(initialTime / 60)} EXP Earned</p>
                            <button className="btn btn-primary mt-2" onClick={resetTimer}>
                                Start Another
                            </button>
                        </div>
                    )}
                </div>

                {!isActive && !isFinished && (
                    <div className="timer-presets slide-in-up" style={{ animationDelay: '100ms' }}>
                        {PRESETS.map(p => (
                            <button
                                key={p.label}
                                className={`preset-btn ${initialTime === p.seconds ? 'active' : ''}`}
                                onClick={() => setPreset(p.seconds)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
