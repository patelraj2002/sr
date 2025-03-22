// src/app/components/property/PropertyGrid.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from './PropertyCard';
import AuthModal from '@/app/components/common/AuthModal';

export default function PropertyGrid({ 
  properties, 
  isAuthenticated = false,
  userType = 'null',
  isOwner = false,
  userId = null 
}) {
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [savedProperties, setSavedProperties] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && userId && userType === 'SEEKER') {
      fetchSavedProperties();
    }
  }, [isAuthenticated, userId, userType]);

  const fetchSavedProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}/saved-properties`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved properties');
      }

      // Update to use the correct data structure
      const savedPropertyIds = data.savedProperties.map(sp => sp.propertyId);
      setSavedProperties(new Set(savedPropertyIds));
    } catch (error) {
      console.error('Error fetching saved properties:', error);
      setError('Failed to fetch saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProperty = async (propertyId) => {
    if (!isAuthenticated) {
      setModalAction('save');
      setSelectedProperty({ id: propertyId });
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      const isSaved = savedProperties.has(propertyId);
      const method = isSaved ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/users/${userId}/saved-properties/${propertyId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isSaved ? 'unsave' : 'save'} property`);
      }

      // Update local state
      setSavedProperties(prev => {
        const newSet = new Set(prev);
        if (isSaved) {
          newSet.delete(propertyId);
        } else {
          newSet.add(propertyId);
        }
        return newSet;
      });

      setSuccess(isSaved ? 'Property removed from saved' : 'Property saved successfully');
      setTimeout(() => setSuccess(''), 3000);

    } catch (error) {
      console.error('Error updating saved property:', error);
      setError(error.message || 'Failed to update saved status');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiryClick = async (property) => {
    if (!isAuthenticated) {
      setModalAction('inquiry');
      setSelectedProperty(property);
      setShowAuthModal(true);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          message: `I am interested in this ${property.type}. Please provide more information.`,
          sharingOptionId: property.type === 'PG' && property.sharingOptions.length > 0
            ? property.sharingOptions[0].id
            : null
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create inquiry');
      }

      setSuccess('Inquiry sent successfully! The owner will contact you soon.');
      setTimeout(() => setSuccess(''), 5000);

    } catch (error) {
      console.error('Error creating inquiry:', error);
      setError(error.message || 'Failed to create inquiry');
      setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-center px-4">
        <div className="space-y-4">
          <p className="text-lg sm:text-xl text-gray-600">
            No properties found.
          </p>
          <p className="text-sm sm:text-base text-gray-500">
            Try adjusting your search criteria or check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Status Messages */}
      <div className="fixed top-4 right-4 z-50 space-y-4 min-w-[200px] sm:min-w-[300px]">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg
            transform transition-all duration-500 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm sm:text-base text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg
            transform transition-all duration-500 animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm sm:text-base text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      )}

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {properties.map((property) => (
          <div key={property.id} className="transform transition-all duration-300 hover:-translate-y-1">
            <PropertyCard
              property={property}
              isAuthenticated={isAuthenticated}
              isSaved={savedProperties.has(property.id)}
              onInquiryClick={handleInquiryClick}
              onSaveClick={handleSaveProperty}
              isOwner={isOwner}
            />
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setSelectedProperty(null);
          setModalAction(null);
        }}
        userType={userType}
        property={selectedProperty}
        action={modalAction}
        className="z-50"
      />
    </div>
  );
}