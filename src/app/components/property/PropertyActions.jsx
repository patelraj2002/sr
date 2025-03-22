// src/app/components/property/PropertyActions.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InquiryForm from './InquiryForm';
import GetDirections from './GetDirections';

export default function PropertyActions({ 
  property, 
  isOwner, 
  isAuthenticated,
  initialSaved = false,
  userId 
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [error, setError] = useState('');

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

  const handleInquiry = async (formData) => {
    if (!isAuthenticated) {
      router.push(`/auth/signin?redirect=/properties/${property.id}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send inquiry');
      }

      setShowInquiryForm(false);
      alert('Inquiry sent successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
        <Link
          href={`/dashboard/owner/${property.ownerId}/properties/${property.id}/edit`}
          className="w-full px-4 py-2 bg-primary-600 text-white text-center rounded-md 
            hover:bg-primary-700 inline-block"
        >
          Edit Property
        </Link>
        {property.latitude && property.longitude && (
          <GetDirections
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.googleAddress || property.location}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShowInquiryForm(true)}
          disabled={loading || !isAuthenticated}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md
            hover:bg-primary-700 transition-colors text-sm sm:text-base font-medium
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send Inquiry
        </button>

        <button
          onClick={handleSaveProperty}
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

        {isAuthenticated && (
          <>
            <a
              href={`tel:${property.owner.phone}`}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md
                hover:bg-green-700 transition-colors text-center text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
                Call Owner
              </span>
            </a>

            <button
              onClick={() => {
                const message = `Hi, I'm interested in your ${property.type}: ${property.title} at ${property.location}`;
                const whatsappUrl = `https://wa.me/${property.owner.phone}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md
                hover:bg-green-600 transition-colors text-sm sm:text-base"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                </svg>
                WhatsApp Owner
              </span>
            </button>
          </>
        )}

        {property.latitude && property.longitude && (
          <GetDirections
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.googleAddress || property.location}
          />
        )}
      </div>

      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Send Inquiry</h3>
            <InquiryForm
              property={property}
              onSubmit={handleInquiry}
              onCancel={() => setShowInquiryForm(false)}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}