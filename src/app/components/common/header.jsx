'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/signin');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth/signin';
    return user.userType === 'OWNER' 
      ? `/dashboard/owner/${user.id}` 
      : '/dashboard/seeker';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - made more responsive */}
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
                <Link
                  href={getDashboardLink()}
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
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
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                  >
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