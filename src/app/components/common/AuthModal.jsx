// src/app/components/common/AuthModal.jsx
'use client';

import { useRouter } from 'next/navigation';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  userType = 'SEEKER',
  action = 'view'
}) {
  const router = useRouter();

  if (!isOpen) return null;

  const getMessage = () => {
    switch (action) {
      case 'inquiry':
        return 'make inquiries about properties';
      case 'save':
        return 'save properties to your favorites';
      default:
        return 'view property details';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sign in Required</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Please sign in to {getMessage()}.
        </p>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => router.push(`/auth/signin?type=${userType}&redirect=${encodeURIComponent(window.location.pathname)}`)}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Sign In
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => router.push(`/auth/signup?type=${userType}`)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}