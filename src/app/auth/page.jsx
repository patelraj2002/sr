// src/app/auth/page.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthTypePage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Selection */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/">
              <Image
                src="/images/logo.png"
                alt="SR Homes"
                width={80}
                height={80}
                className="mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome to SR Homes
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Choose how you want to join us
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Link
              href="/auth/signup?type=OWNER"
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              I want to list my property
            </Link>

            <Link
              href="/auth/signup?type=SEEKER"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              I'm looking for a property
            </Link>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="/images/background.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
          <div className="max-w-lg text-center p-8">
            <h2 className="text-4xl font-bold mb-4">
              Find Your Perfect Space
            </h2>
            <p className="text-xl">
              Whether you're listing your property or searching for your next home,
              we're here to help you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}