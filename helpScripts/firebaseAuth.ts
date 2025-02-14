/* eslint-disable @typescript-eslint/no-explicit-any */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';

interface AuthResponse {
    user: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
    } | null;
    error: string | null;
}

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY!,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.FIREBASE_PROJECT_ID!,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.FIREBASE_APP_ID!
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<AuthResponse> {
    try {
        const result: UserCredential = await signInWithPopup(auth, googleProvider);
        const user: User = result.user;

        return {
            user: {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            },
            error: null
        };
    } catch (error) {
        console.error('Firebase Google sign in failed:', error);
        return {
            user: null,
            error: 'Failed to sign in with Google'
        };
    }
}

export async function signOut(): Promise<{ error: string | null }> {
    try {
        await auth.signOut();
        return { error: null };
    } catch (error) {
        console.error('Sign out failed:', error);
        return { error: 'Failed to sign out' };
    }
}

// Export auth instance for use in components
export { auth }; 