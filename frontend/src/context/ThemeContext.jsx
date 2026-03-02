import { createContext, useContext, useState, useEffect } from 'react'

// The 4 themes of EKANT
const THEMES = ['forest', 'ocean', 'night', 'bloom']

const THEME_LABELS = {
    forest: '🌿 Forest',
    ocean: '🌊 Ocean',
    night: '🌙 Night',
    bloom: '🌸 Bloom',
}

// Create the context (a shared "box" all components can read from)
const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    // Load saved theme from localStorage, or default to 'forest'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('ekant-theme') || 'forest'
    })

    // Whenever theme changes, apply it to the <html> element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('ekant-theme', theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, THEMES, THEME_LABELS }}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook — any component can call useTheme() to get/set theme
export function useTheme() {
    return useContext(ThemeContext)
}
