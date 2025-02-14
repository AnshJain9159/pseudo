"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import GoogleSignInButton to prevent server-side rendering issues
//nst GoogleSignInButton = dynamic(() => import('components/GoogleSignInButton'), { ssr: false });

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard'); // Temporary navigation without auth
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => router.push('/dashboard')}>Sign In</button>
      
    </div>
  );
}
