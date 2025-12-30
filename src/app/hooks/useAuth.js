// src/app/hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Signout error:', error);
    }
  };

  return { user, loading, signOut };
}