import { useSettings } from '../context/SettingsContext'
import { useUser } from '../context/UserContext'
import { BACKGROUNDS } from '../components/ThemeBackground'
import './Settings.css'

const TOGGLE_ROWS = [
    {
        key: 'liveBg',
        label: '🎋 Live Background',
        desc: 'Animated scenic background behind the app',
    },
    {
        key: 'hideFromLeaderboard',
        label: '🙈 Hide Me from Leaderboard',
        desc: "You won't appear in the public rankings",
    },
    {
        key: 'hideStreak',
        label: '🔥 Hide My Streak from Others',
        desc: 'Your streak count stays private on the leaderboard',
    },
    {
        key: 'showProof',
        label: '📸 Show My Proof Photos',
        desc: 'Let others see your task completion photos on the leaderboard',
    },
    {
        key: 'digitalSilenceMode',
        label: '🔇 Digital Silence Mode',
        desc: 'Hide EXP, streaks, and leaderboards to focus purely on recovery',
    },
    {
        key: 'shareJournal',
        label: '📝 Share Journal on Leaderboard',
        desc: 'Let others read your latest task reflection on the global leaderboard',
    },
]

function Settings() {
    const { settings, updateSetting } = useSettings()
    const { updateSettings: updateFirestoreSettings } = useUser()

    function handleToggleChange(key, value) {
        // Update local state and localStorage
        updateSetting(key, value)

        // Push the new settings object to Firestore so social features actually work globally
        const newSettings = { ...settings, [key]: value }
        updateFirestoreSettings(newSettings)
    }

    return (
        <div className="page">
            <div className="settings-header">
                <h1>⚙️ Settings</h1>
                <p>Your preferences are saved automatically.</p>
            </div>

            {/* Background Preset Picker */}
            <div className="card settings-group">
                <h3 className="group-title">Background Preset</h3>
                <p className="group-desc">Choose your scenic background. Each has a gentle wind animation.</p>
                <div className="bg-presets">
                    {BACKGROUNDS.map(bg => (
                        <button
                            key={bg.id}
                            className={`bg-preset-btn ${settings.selectedBg === bg.id ? 'active' : ''}`}
                            onClick={() => updateSetting('selectedBg', bg.id)}
                            style={{ backgroundImage: `url(${bg.img})` }}
                            title={bg.label}
                        >
                            <span className="bg-preset-label">{bg.label}</span>
                            {settings.selectedBg === bg.id && (
                                <span className="bg-preset-check">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Toggle Rows */}
            <div className="card settings-group">
                <h3 className="group-title">Privacy & Display</h3>
                {TOGGLE_ROWS.map(row => (
                    <div key={row.key} className="setting-row">
                        <div className="setting-info">
                            <span className="setting-label">{row.label}</span>
                            <span className="setting-desc">{row.desc}</span>
                        </div>
                        <label className="toggle">
                            <input
                                type="checkbox"
                                checked={settings[row.key]}
                                onChange={e => handleToggleChange(row.key, e.target.checked)}
                            />
                            <span className="toggle-slider" />
                        </label>
                    </div>
                ))}
            </div>

            <div className="card settings-info-card">
                <p>🌱 <strong>EKANT</strong> is designed to help you recover without pressure. Your data is yours — share only what you're comfortable with.</p>
            </div>
        </div>
    )
}

export default Settings
