import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../context/UserContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import './OnboardingOverlay.css'

const PRESET_AVATARS = [
    '🌱', '🌿', '🎋', '🧘', '🍵', '🪷', '🏔️', '🌊', '🕯️', '🕊️'
]

function OnboardingOverlay() {
    const { user } = useAuth()
    const { userData } = useUser()
    const [name, setName] = useState(user?.displayName || '')
    const [hobby, setHobby] = useState('')
    const [avatar, setAvatar] = useState('🌱')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Only show if user is logged in, their data loaded, and profileComplete is falsy
    if (!user || !userData || userData.profileComplete) {
        return null
    }

    async function handleSubmit(e) {
        e.preventDefault()
        if (!name.trim()) {
            setError('Please enter a display name.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const userRef = doc(db, 'users', user.uid)
            await updateDoc(userRef, {
                name: name.trim(),
                hobby: hobby.trim(),
                avatar: avatar,
                profileComplete: true
            })
            // The UserContext listener will pick this up automatically and hide the overlay
        } catch (err) {
            console.error(err)
            setError('Failed to save profile. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="onboarding-overlay glass-overlay fade-in">
            <div className="onboarding-card slide-in-bottom">

                <div className="onboarding-header">
                    <h2>Welcome to EKANT</h2>
                    <p>Let's personalize your recovery space.</p>
                </div>

                <form onSubmit={handleSubmit} className="onboarding-form">

                    <div className="form-group avatar-selection">
                        <label>Choose your spirit icon</label>
                        <div className="avatar-grid">
                            {PRESET_AVATARS.map(emoji => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className={`avatar-btn ${avatar === emoji ? 'selected' : ''}`}
                                    onClick={() => setAvatar(emoji)}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="displayName">What should we call you?</label>
                        <input
                            id="displayName"
                            type="text"
                            className="input-field glass-input"
                            placeholder="Your display name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={20}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="hobby">What is your main hobby?</label>
                        <input
                            id="hobby"
                            type="text"
                            className="input-field glass-input"
                            placeholder="e.g. Reading, Painting, Running..."
                            value={hobby}
                            onChange={(e) => setHobby(e.target.value)}
                            maxLength={30}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary onboarding-submit"
                        disabled={loading || !name.trim()}
                    >
                        {loading ? 'Setting up...' : 'Enter your sanctuary'}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default OnboardingOverlay
