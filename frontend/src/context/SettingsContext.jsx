import { createContext, useContext, useState } from 'react'

const SettingsContext = createContext()

const DEFAULT_SETTINGS = {
    liveBg: true,
    selectedBg: 'bamboo',   // which of the 4 backgrounds is active
    hideFromLeaderboard: false,
    hideStreak: false,
    showProof: true,
}

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('ekant-settings')
            return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
        } catch {
            return DEFAULT_SETTINGS
        }
    })

    function updateSetting(key, value) {
        setSettings(prev => {
            const next = { ...prev, [key]: value }
            localStorage.setItem('ekant-settings', JSON.stringify(next))
            return next
        })
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    return useContext(SettingsContext)
}
