import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Breathe.css'

const TRACKS = [
    { id: 'rain', label: '🌧️ Rain', src: '/audio/Rain_Sound_(256k).mp3' },
    { id: 'forest', label: '🌲 Forest', src: '/audio/Forest Sound.mp3' },
    { id: 'bowl', label: '🥣 Singing Bowl', src: '/audio/Singing_Bowl_(256k).mp3' }
]

function Breathe() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false)
    const [phase, setPhase] = useState('Ready') // Ready, Inhale, Hold, Exhale, Hold (Empty)
    const [selectedTrack, setSelectedTrack] = useState(TRACKS[0])

    const audioRef = useRef(null)

    // Handle audio play/pause when active state changes
    useEffect(() => {
        if (isActive) {
            audioRef.current?.play().catch(e => console.log('Audio autoplay blocked', e))
        } else {
            audioRef.current?.pause()
        }
    }, [isActive])

    // Update track src when selected, keep playing if active
    useEffect(() => {
        if (audioRef.current) {
            const wasPlaying = !audioRef.current.paused
            audioRef.current.src = selectedTrack.src
            if (wasPlaying && isActive) {
                audioRef.current.play().catch(e => console.log(e))
            }
        }
    }, [selectedTrack, isActive])

    // Box Breathing phase timer logic (16s cycle)
    useEffect(() => {
        if (!isActive) {
            setPhase('Ready')
            return
        }

        let cycleTimeout
        let holdFullTimeout
        let exhaleTimeout
        let holdEmptyTimeout

        const runCycle = () => {
            setPhase('Inhale...') // 0-4s

            holdFullTimeout = setTimeout(() => {
                setPhase('Hold...') // 4-8s
            }, 4000)

            exhaleTimeout = setTimeout(() => {
                setPhase('Exhale...') // 8-12s
            }, 8000)

            holdEmptyTimeout = setTimeout(() => {
                setPhase('Hold...') // 12-16s
            }, 12000)

            cycleTimeout = setTimeout(runCycle, 16000)
        }

        // Start first cycle
        runCycle()

        return () => {
            clearTimeout(cycleTimeout)
            clearTimeout(holdFullTimeout)
            clearTimeout(exhaleTimeout)
            clearTimeout(holdEmptyTimeout)
        }
    }, [isActive])

    return (
        <div className="page breathe-page slide-in-bottom">
            <button className="btn back-btn" onClick={() => navigate('/dashboard')} style={{ position: 'absolute', top: '20px', left: '20px' }}>
                ← Dashboard
            </button>

            <div className="breathe-header">
                <h1>Box Breathing</h1>
                <p>Find your center. 4 seconds inhale, 4 hold, 4 exhale, 4 hold.</p>
            </div>

            <div className="breathe-container">
                <div className={`breathe-circle ${isActive ? 'active' : ''}`}></div>
                <div className="breathe-text">{phase}</div>
            </div>

            <div className="audio-controls">
                <div className="audio-track-selector">
                    {TRACKS.map(track => (
                        <button
                            key={track.id}
                            className={`track-btn ${selectedTrack.id === track.id ? 'active' : ''}`}
                            onClick={() => setSelectedTrack(track)}
                        >
                            {track.label}
                        </button>
                    ))}
                </div>

                <div className="breathe-actions">
                    {!isActive ? (
                        <button className="btn-breathe" onClick={() => setIsActive(true)}>
                            Start Breathing
                        </button>
                    ) : (
                        <button className="btn-stop" onClick={() => setIsActive(false)}>
                            Pause
                        </button>
                    )}
                </div>
            </div>

            {/* Hidden audio element for ambient sounds */}
            <audio ref={audioRef} loop />
        </div>
    )
}

export default Breathe
