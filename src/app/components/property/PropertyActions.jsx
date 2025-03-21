// src/app/components/property/PropertyActions.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PropertyActions({ 
  property, 
  isOwner, 
  isAuthenticated,
  initialSaved = false,
  userId 
}) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleSaveProperty = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?redirect=/properties/${property.id}`);
      return;
    }

    setLoading(true);
    try {
      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch(
        `/api/users/${userId}/saved-properties/${property.id}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || (isSaved ? 'Failed to unsave property' : 'Failed to save property'));
      }

      setIsSaved(!isSaved);

    } catch (error) {
      console.error('Error saving property:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <Link
        href={`/dashboard/owner/${property.ownerId}/properties/${property.id}/edit`}
        className="w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700"
      >
        Edit Property
      </Link>
    );
  }

  return (
    <div className="space-y-3">
      {isAuthenticated ? (
        <>
          <button
            onClick={handleSaveProperty}
            disabled={loading}
            className={`w-full px-4 py-2 ${
              isSaved 
                ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            } border border-primary-600 rounded-md transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Processing...' : (isSaved ? 'Saved' : 'Save Property')}
          </button>
          <Link
            href={`/inquiries/new?propertyId=${property.id}`}
            className="w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 block"
          >
            Make Inquiry
          </Link>
        </>
      ) : (
        <Link
          href={`/auth/signin?redirect=/properties/${property.id}`}
          className="w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md hover:bg-primary-700 block"
        >
          Sign in to Inquire
        </Link>
      )}
    </div>
  );
}