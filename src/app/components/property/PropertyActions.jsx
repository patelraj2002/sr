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
      const response = await fetch(`/api/users/${userId}/saved-properties/${property.id}`, {
        method: isSaved ? 'DELETE' : 'POST',
      });

      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving property:', error);
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
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3">
        {isOwner ? (
          <>
            <button
              onClick={handleEditClick}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md
                hover:bg-primary-700 transition-colors text-sm sm:text-base font-medium"
            >
              Edit Property
            </button>
            {property.latitude && property.longitude && (
              <GetDirections
                latitude={property.latitude}
                longitude={property.longitude}
                address={property.googleAddress || property.location}
              />
            )}
          </>
        ) : (
          <>
            <button
              onClick={handleInquiryClick}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md
                hover:bg-primary-700 transition-colors text-sm sm:text-base font-medium
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send Inquiry
            </button>
            <button
              onClick={handleSaveClick}
              disabled={loading || !isAuthenticated}
              className={`w-full px-4 py-2 rounded-md transition-colors
                text-sm sm:text-base font-medium flex items-center justify-center gap-2
                ${isSaved 
                  ? 'bg-primary-50 text-primary-600 hover:bg-primary-100' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <svg 
                className="w-5 h-5" 
                fill={isSaved ? "currentColor" : "none"} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
              {isSaved ? 'Saved' : 'Save Property'}
            </button>
            {property.latitude && property.longitude && (
              <GetDirections
                latitude={property.latitude}
                longitude={property.longitude}
                address={property.googleAddress || property.location}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}