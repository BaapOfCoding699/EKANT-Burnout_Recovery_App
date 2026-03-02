import { useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import './TaskCard.css'

const CATEGORY_COLORS = {
    Wellness: 'cat-wellness',
    Physical: 'cat-physical',
    Hobby: 'cat-hobby',
    Social: 'cat-social',
    Adventure: 'cat-adventure',
    Music: 'cat-music',
    Research: 'cat-research',
    Habit: 'cat-habit',
}

export default function TaskCard({
    task, tierConfig,
    proofFile, proofPreview,
    experienceText, setExperienceText,
    completed, celebrating, lastGain, isLastTask,
    onComplete, onNextTask, onChangeTier,
    setProofFile, setProofPreview,
}) {
    const fileInputRef = useRef()
    const { settings } = useSettings()
    const baseExp = tierConfig?.exp || 5

    function handleUpload(e) {
        const file = e.target.files[0]
        if (!file) return
        setProofFile(file)
        setProofPreview(URL.createObjectURL(file))
    }

    function removeProof() {
        setProofFile(null)
        setProofPreview(null)
    }

    return (
        <div className={`task-focus-card card slide-in-up ${celebrating ? 'task-celebrating' : ''}`}>

            {/* Top row */}
            <div className="task-focus-top">
                <div className="task-meta-left">
                    <span className={`category-badge ${CATEGORY_COLORS[task.category] || 'cat-wellness'}`}>
                        {task.category}
                    </span>
                    <span className="tier-badge">{tierConfig?.icon} {tierConfig?.label}</span>
                </div>
                <div className="exp-hints">
                    <span className="task-reward-badge">+{baseExp} EXP</span>
                    <span className="task-reward-badge proof-bonus">+{baseExp + 5} EXP with 📸</span>
                </div>
            </div>

            <h2 className="task-focus-title">{task.title}</h2>
            <p className="task-focus-desc">{task.description}</p>

            {/* Proof Upload */}
            {!completed && (
                <div className="proof-section">
                    <p className="proof-label">
                        📸 Proof <span className="optional-tag">optional · earns +5 bonus EXP</span>
                    </p>
                    {proofPreview ? (
                        <div className="proof-preview-wrap">
                            <img src={proofPreview} alt="proof" className="proof-preview" />
                            <button className="btn btn-ghost proof-remove" onClick={removeProof}>
                                ✕ Remove
                            </button>
                        </div>
                    ) : (
                        <button
                            className="btn btn-ghost proof-upload-btn"
                            onClick={() => fileInputRef.current.click()}
                        >📷 Upload a photo (+5 bonus EXP)</button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleUpload}
                    />
                </div>
            )}

            {/* Experience Input */}
            {!completed && (
                <div className="experience-input-section slide-in-up" style={{ animationDelay: '100ms' }}>
                    <p className="proof-label">
                        📝 Journal <span className="optional-tag">how did this task make you feel?</span>
                    </p>
                    <textarea
                        className="experience-textarea"
                        placeholder="It felt deeply peaceful to just sit..."
                        value={experienceText}
                        onChange={(e) => setExperienceText(e.target.value)}
                        rows={3}
                    />
                </div>
            )}

            {/* Mark Done / Next / Change */}
            {!completed ? (
                <div className="task-actions">
                    <button className="btn btn-primary task-complete-btn" onClick={onComplete}>
                        ✅ Mark as Done
                    </button>
                    <button className="btn btn-ghost change-tier-btn" onClick={onChangeTier}>
                        ↩ Change section
                    </button>
                </div>
            ) : (
                <div className="task-done-state">
                    <div className="done-emoji">🎉</div>
                    {!settings?.digitalSilenceMode ? (
                        <p className="done-msg">
                            +{lastGain} EXP earned!{proofFile ? ' 📸 Proof bonus included!' : ''}
                        </p>
                    ) : (
                        <p className="done-msg" style={{ color: 'var(--text-color)' }}>
                            Task complete. Well done.
                        </p>
                    )}
                    {!isLastTask ? (
                        <button className="btn btn-primary" onClick={onNextTask}>
                            Next Task →
                        </button>
                    ) : (
                        <p className="all-done-msg">🌿 You have finished all tasks in this section!</p>
                    )}
                </div>
            )}
        </div>
    )
}
