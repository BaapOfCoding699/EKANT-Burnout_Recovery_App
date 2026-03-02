import { createContext, useContext, useEffect, useState } from 'react'
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp, collection, addDoc, query, orderBy } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from './AuthContext'

const UserContext = createContext(null)

// Default user data structure for new users
const DEFAULT_USER_DATA = {
    exp: 0,
    streak: 0,
    lastActive: null,
    totalTasks: 0,
    hideFromLeaderboard: false,
    hideStreak: false,
    showProof: true,
}

export function UserProvider({ children }) {
    const { user, loading: authLoading } = useAuth()
    const [userData, setUserData] = useState(null)
    const [screenTimeLogs, setScreenTimeLogs] = useState([])
    const [loadingUser, setLoadingUser] = useState(true)

    useEffect(() => {
        if (authLoading) return // Wait for auth to settle

        if (!user) {
            setUserData(null)
            setLoadingUser(false)
            return
        }

        // We have a logged-in user. Let's subscribe to their Firestore doc.
        const userRef = doc(db, 'users', user.uid)

        const unsubscribeUser = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data()

                // Handle streak logic here automatically
                const updatedData = await checkAndUpdateStreak(userRef, data)
                setUserData(updatedData)
                setLoadingUser(false)
            } else {
                // User document doesn't exist yet (first time login)
                const newUserData = {
                    ...DEFAULT_USER_DATA,
                    uid: user.uid,
                    name: user.displayName || 'Friend',
                    photoURL: user.photoURL || null,
                    joinedAt: serverTimestamp(),
                    lastActive: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
                }
                await setDoc(userRef, newUserData)
                // The onSnapshot will fire again after setDoc
            }
        }, (error) => {
            console.error("Error fetching user data:", error)
            setLoadingUser(false)
        })

        // Also subscribe to screen time logs so the dashboard knows if they logged today
        const screenLogsRef = collection(db, `users/${user.uid}/screenTimeLogs`)
        const screenLogsQuery = query(screenLogsRef, orderBy('timestamp', 'desc'))

        const unsubscribeLogs = onSnapshot(screenLogsQuery, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            setScreenTimeLogs(logs)
        }, (error) => {
            console.error("Error fetching screen logs:", error)
        })

        return () => {
            unsubscribeUser()
            unsubscribeLogs()
        }
    }, [user, authLoading])

    // Helper: Check if streak needs resetting or if lastActive needs updating
    async function checkAndUpdateStreak(userRef, data) {
        const todayStr = new Date().toISOString().split('T')[0]
        const lastActiveStr = data.lastActive

        if (!lastActiveStr) {
            // First time ever doing a check
            await updateDoc(userRef, { lastActive: todayStr })
            return { ...data, lastActive: todayStr }
        }

        if (lastActiveStr === todayStr) {
            // Already active today, streak is safe
            return data
        }

        // Check difference in days
        const lastDate = new Date(lastActiveStr)
        const todayDate = new Date(todayStr)
        const diffTime = Math.abs(todayDate - lastDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
            // Missed no days (last active was yesterday). 
            // We DO NOT increment here. Increment happens when they *complete* a task.
            // But we don't reset.
            return data
        } else if (diffDays > 1) {
            // Missed a day! Reset streak to 0.
            await updateDoc(userRef, {
                streak: 0,
                lastActive: todayStr
            })
            return { ...data, streak: 0, lastActive: todayStr }
        }

        return data
    }

    // --- Actions ---

    // Called when user completes a task
    async function addExp(amount, taskLogData = null) {
        if (!user || !userData) return
        const userRef = doc(db, 'users', user.uid)
        const todayStr = new Date().toISOString().split('T')[0]

        // Calculate new exp and streak
        let newStreak = userData.streak
        let newTotalTasks = (userData.totalTasks || 0) + 1

        // If lastActive was NOT today, it means this is their FIRST task of the day!
        if (userData.lastActive !== todayStr) {
            newStreak += 1
        }


        const updates = {
            exp: userData.exp + amount,
            streak: newStreak,
            totalTasks: newTotalTasks,
            lastActive: todayStr, // Update last active so they don't get double streak today
        }

        // Check if user wants to share their journal on the leaderboard
        const savedSettings = JSON.parse(localStorage.getItem('ekant-settings') || '{}')
        if (savedSettings?.shareJournal && taskLogData?.experienceText) {
            updates.latestJournal = taskLogData.experienceText
        }

        await updateDoc(userRef, updates)

        if (taskLogData) {
            const logsRef = collection(db, `users/${user.uid}/taskLogs`)
            await addDoc(logsRef, {
                ...taskLogData,
                timestamp: serverTimestamp()
            })
        }
    }

    // Toggle privacy settings
    async function updateSettings(newSettings) {
        if (!user) return
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, newSettings)
    }

    // Log daily screen time
    async function logScreenTime(hours, minutes) {
        if (!user) return
        const logsRef = collection(db, `users/${user.uid}/screenTimeLogs`)

        // We use string date as ID to prevent multiple logs per day.
        // Get local date string in YYYY-MM-DD format to avoid UTC mismatch.
        const now = new Date()
        const offset = now.getTimezoneOffset() * 60000
        const todayStr = new Date(now - offset).toISOString().split('T')[0]

        await setDoc(doc(logsRef, todayStr), {
            hours: Number(hours),
            minutes: Number(minutes),
            totalMinutes: (Number(hours) * 60) + Number(minutes),
            timestamp: serverTimestamp()
        })
    }

    const value = {
        userData,
        screenTimeLogs,
        loadingUser,
        addExp,
        updateSettings,
        logScreenTime,
    }

    if (loadingUser && user) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '1.1rem',
                color: '#4a7c59',
                gap: '0.75rem',
            }}>
                <span style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>🌿</span>
                Loading profile...
            </div>
        )
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const ctx = useContext(UserContext)
    if (!ctx) throw new Error('useUser must be used inside <UserProvider>')
    return ctx
}
