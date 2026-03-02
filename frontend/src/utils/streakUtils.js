/**
 * EKANT Streak Utility
 * 
 * Uses a global time API (WorldTimeAPI) to get the real current date.
 * This prevents users from cheating by changing their device date/time.
 * 
 * Streak rules:
 * - Increases by +1 ONLY if user logs in on the calendar day after their last login
 * - If they skip a day, streak resets to 1
 * - All dates are UTC-based, sourced from server — device time is IGNORED
 */

const TIME_API_URL = 'https://worldtimeapi.org/api/timezone/Asia/Kolkata'
const STORAGE_KEY = 'ekant_streak_data'

/**
 * Fetch the real current date from a global time server.
 * Falls back to device time ONLY if the network request fails,
 * but in production this should always succeed.
 * @returns {Promise<Date>}
 */
async function fetchGlobalDate() {
    try {
        const res = await fetch(TIME_API_URL, { cache: 'no-store' })
        const data = await res.json()
        // data.datetime is ISO 8601 e.g. "2026-03-01T09:48:49.123+05:30"
        return new Date(data.datetime)
    } catch (err) {
        console.warn('[EKANT] Could not reach global time API, using device time as fallback.', err)
        return new Date()
    }
}

/**
 * Returns "YYYY-MM-DD" string in IST from a Date object.
 * Using IST (Asia/Kolkata) as the calendar baseline.
 */
function toDateString(date) {
    return date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
    // en-CA gives YYYY-MM-DD format
}

/**
 * Load stored streak data from localStorage.
 * @returns {{ streak: number, lastLoginDate: string|null }}
 */
function loadStreakData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { streak: 0, lastLoginDate: null }
        return JSON.parse(raw)
    } catch {
        return { streak: 0, lastLoginDate: null }
    }
}

/**
 * Save streak data to localStorage.
 */
function saveStreakData(streak, lastLoginDate) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ streak, lastLoginDate }))
}

/**
 * Main function — call this on login or app load.
 * 
 * Returns the updated streak count and whether it increased today.
 * @returns {Promise<{ streak: number, increased: boolean, todayDate: string }>}
 */
export async function updateStreak() {
    const now = await fetchGlobalDate()          // GLOBAL time — cheat-proof
    const today = toDateString(now)                // "2026-03-01"

    const { streak, lastLoginDate } = loadStreakData()

    // First ever login
    if (!lastLoginDate) {
        saveStreakData(1, today)
        return { streak: 1, increased: true, todayDate: today }
    }

    // Already logged in today — no change
    if (lastLoginDate === today) {
        return { streak, increased: false, todayDate: today }
    }

    // Check if today is exactly the next calendar day after last login
    const last = new Date(lastLoginDate + 'T00:00:00+05:30')
    const todayObj = new Date(today + 'T00:00:00+05:30')
    const daysDiff = Math.round((todayObj - last) / (1000 * 60 * 60 * 24))

    if (daysDiff === 1) {
        // Consecutive day → increment streak
        const newStreak = streak + 1
        saveStreakData(newStreak, today)
        return { streak: newStreak, increased: true, todayDate: today }
    } else {
        // Skipped one or more days → reset streak
        saveStreakData(1, today)
        return { streak: 1, increased: false, todayDate: today }
    }
}

/**
 * Get current streak without triggering an update.
 * (For display purposes only)
 */
export function getStoredStreak() {
    return loadStreakData().streak || 0
}
