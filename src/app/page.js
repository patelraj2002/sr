// src/app/page.js
'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/app/components/common/header';
import BackgroundImage from './components/common/BackgroundImage';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:transform hover:scale-105 transition-all duration-300">
      <div className="text-primary-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleListProperty = () => {
    if (!user) {
      router.push('/auth?type=OWNER');
      return;
    }

    if (user.userType === 'OWNER') {
      router.push(`/dashboard/owner/${user.id}`);
    } else {
      alert('You need an owner account to list properties. Please create a new owner account.');
      router.push('/auth?type=OWNER');
    }
  };

  const handleFindProperty = () => {
    if (!user) {
      router.push('/dashboard/seeker');
      return;
    }

    if (user.userType === 'SEEKER') {
      router.push(`/dashboard/seeker/${user.id}`);
    } else {
      router.push('/dashboard/seeker');
    }
  };

  if (loading) {
    return <LoadingFallback />;
  }

  return (
    <main className="min-h-screen relative">
      <BackgroundImage />
      
      <div className="absolute inset-0 bg-black/40 z-5" />

      <div className="relative z-10">
        <Suspense fallback={<LoadingFallback />}>
          <Header />
          
          {/* Hero Section */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center space-y-12">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white drop-shadow-2xl">
                  Find Your Perfect{' '}
                  <span className="text-primary-500 drop-shadow-lg">
                    Home
                  </span>
                </h1>
              </div>

              <p className="text-xl md:text-2xl leading-8 text-white drop-shadow-lg font-semibold">
                Discover the best PG accommodations and rental properties in your area.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                <button
                  onClick={handleFindProperty}
                  className="w-64 sm:w-auto rounded-lg bg-primary-500 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-primary-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Find Properties
                </button>
                <button
                  onClick={handleListProperty}
                  className="w-64 sm:w-auto rounded-lg bg-secondary-500 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:bg-secondary-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  List Your Property
                </button>
              </div>

              {user && (
                <div className="text-white text-lg">
                  Welcome back, {user.name}!{' '}
                  <Link 
                    href={`/dashboard/${user.userType.toLowerCase()}/${user.id}`}
                    className="text-primary-500 hover:text-primary-400 underline"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                  title="Verified Properties"
                  description="All our properties are thoroughly verified for your peace of mind."
                />
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="Best Prices"
                  description="Find accommodations that perfectly fit your budget."
                />
                <FeatureCard
                  icon={
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  }
                  title="24/7 Support"
                  description="Our support team is always ready to help you."
                />
              </div>
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
}