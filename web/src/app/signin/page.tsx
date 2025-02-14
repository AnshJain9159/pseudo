"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleSignInButton from 'components/GoogleSignInButton';
import router from 'next/router';

const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary direct navigation without auth
    router.push('/dashboard');

    /* Authentication temporarily disabled
    setError('');
    setLoading(true);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/dashboard');
    } catch (error: any) {
        console.error('Sign in error:', error);
        if (error.code === 'auth/network-request-failed') {
            setError('Network error. Please check your internet connection and try again.');
        } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            setError('Invalid email or password.');
        } else if (error.code === 'auth/too-many-requests') {
            setError('Too many failed attempts. Please try again later.');
        } else {
            setError('Failed to sign in. Please try again.');
        }
    } finally {
        setLoading(false);
    }
    */
};

const handleGoogleError = (error: string) => {
    setError('Temporarily disabled');
};
function setError(arg0: string) {
    throw new Error('Function not implemented.');
}

