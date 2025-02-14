'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GoogleSignInButton from '../../components/GoogleSignInButton';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        // Temporary direct navigation without auth
        router.push('/main');
        
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

    const handleGoogleSuccess = () => {
        router.push('/main');
    };

    const handleGoogleError = (error: string) => {
        setError('Temporarily disabled');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-lg">
                <div>
                    <div className="flex justify-center">
                        <img
                            src="/brain-icon.svg"
                            alt="Socrates Logo"
                            className="h-12 w-12 text-purple-500"
                        />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Sign in to Socrates
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Unlock your AI-powered coding assistant.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleEmailSignIn}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-t-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-700 rounded-b-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <GoogleSignInButton
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/sign-up" className="font-medium text-purple-500 hover:text-purple-400">
                            Sign up for Socrates
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
} 