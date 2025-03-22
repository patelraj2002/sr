// src/app/components/common/header.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      localStorage.removeItem('user');
      setUser(null);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/signin';
    return user.userType === 'OWNER' 
      ? `/dashboard/owner/${user.id}` 
      : `/dashboard/seeker/${user.id}`;
  };

  const isPropertiesPage = pathname === '/properties';

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="SR Homes"
              width={40}
              height={40}
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-xl sm:text-2xl font-bold">
              <span className="text-primary-500">SR</span>
              <span className="text-secondary-500">Homes</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {user ? (
              <>
                {/* Show My Dashboard button only for seekers on properties page */}
                {user.userType === 'SEEKER' && isPropertiesPage && (
                  <Link
                    href={getDashboardLink()}
                    className="bg-primary-100 text-primary-600 px-4 py-2 rounded-md 
                      hover:bg-primary-200 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                      />
                    </svg>
                    My Dashboard
                  </Link>
                )}

                {user.userType === 'OWNER' && (
                  <Link
                    href="/properties/new"
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Add Property
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md 
                      hover:bg-primary-600 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                      />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/properties"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Find Properties
                </Link>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 p-3"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2 bg-white">
            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  {user.userType === 'SEEKER' && isPropertiesPage && (
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 text-primary-600 px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                        />
                      </svg>
                      My Dashboard
                    </Link>
                  )}
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user.userType === 'OWNER' && (
                    <Link
                      href="/properties/new"
                      className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-3"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Add Property
                    </Link>
                  )}
                  <div className="px-4 py-3">
                    <span className="block text-gray-700 mb-3">Welcome, {user.name}</span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="bg-primary-500 text-white px-4 py-3 rounded-md hover:bg-primary-600 transition-colors w-full"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/properties"
                    className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Properties
                  </Link>
                  <Link
                    href="/auth/signin"
                    className="text-gray-700 hover:text-primary-600 transition-colors px-4 py-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="bg-primary-500 text-white px-4 py-3 mx-4 mb-2 rounded-md hover:bg-primary-600 transition-colors text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}