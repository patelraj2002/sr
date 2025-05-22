'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteAccount({ userId }) {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/users/${userId}/delete`, {
          method: 'DELETE',
          credentials: 'include',
        });
        
        if (response.ok) {
          // Clear any local storage if exists
          localStorage.clear();
          router.push('/');
        } else {
          const data = await response.json();
          setError(data.error || 'Failed to delete account');
        }
      } catch (err) {
        setError('Failed to delete account. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Account</h3>
      {error && (
        <p className="text-red-600 mb-4">{error}</p>
      )}
      <p className="text-sm text-gray-600 mb-4">
        Warning: This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
      </p>
      <button
        onClick={handleDeleteAccount}
        className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete Account
      </button>
    </div>
  );
}