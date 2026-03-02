// ─────────────────────────────────────────────────────────────────────────────
// firebase.js — Firebase SDK initialisation
// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Replace the placeholder values below with YOUR Firebase config.
// Get it from: Firebase Console → Project Settings → Your Apps → SDK setup
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAtz405tdmDrmiFzgJ7rceTICrt8Tvpi9Q",
    authDomain: "ekant-d39c3.firebaseapp.com",
    projectId: "ekant-d39c3",
    storageBucket: "ekant-d39c3.firebasestorage.app",
    messagingSenderId: "282498437602",
    appId: "1:282498437602:web:3fa595c3199d6c176fa9bb",
}

// Initialise Firebase
const app = initializeApp(firebaseConfig)

// Auth instance and Google provider — exported and used in AuthContext
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
