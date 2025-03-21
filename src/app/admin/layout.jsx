// src/app/admin/layout.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminNav from '@/app/components/admin/AdminNav';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    try {
      const adminAuth = localStorage.getItem('adminAuth');
      if (!adminAuth && pathname !== '/admin/login') {
        router.push('/admin/login');
        return;
      }
      
      if (adminAuth && pathname === '/admin/login') {
        router.push('/admin/dashboard');
        return;
      }
    } catch (error) {
      setError('Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminAuth');
      router.push('/admin/login');
    } catch (error) {
      setError('Logout failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{error}</h3>
          <button
            onClick={() => {
              setError(null);
              checkAuth();
            }}
            className="text-primary-600 hover:text-primary-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav onLogout={handleLogout} />
      <div className="ml-64 min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {pathname.split('/').pop().charAt(0).toUpperCase() + pathname.split('/').pop().slice(1)}
            </h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}