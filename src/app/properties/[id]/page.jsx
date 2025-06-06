// src/app/properties/[id]/page.jsx
'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getClientSession } from '@/app/utils/clientAuth';
import PropertyMap from '@/app/components/property/PropertyMap';
import PropertyActions from '@/app/components/property/PropertyActions';
import { useSavedStatus } from '@/app/components/property/SavedStatus';
import { amenitiesData } from '@/app/utils/amenities';


export default function PropertyPage({ params }) {
  const { id } = use(params);
  const [property, setProperty] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isSaved, loading: savedLoading } = useSavedStatus({
    propertyId: id,
    userId: session?.id
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch session
        const sessionData = await getClientSession();
        setSession(sessionData);

        // Fetch property data
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error('Failed to fetch property');
        const data = await response.json();
        
        if (!data.property) {
          notFound();
        }

        setProperty(data.property);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading || savedLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return notFound();
  }

  const isOwner = session?.id === property.ownerId;


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button - Mobile friendly with proper touch target */}
        <div className="mb-4 sm:mb-6">
          <Link
            href={isOwner ? `/dashboard/owner/${session?.id}/properties` : '/properties'}
            className="inline-flex items-center px-3 py-2 text-primary-600 hover:text-primary-700 
              hover:bg-primary-50 rounded-lg transition-colors text-sm sm:text-base touch-manipulation"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hover:underline">
              Back to {isOwner ? 'My Properties' : 'Properties'}
            </span>
          </Link>
        </div>

        {/* Property Images - Responsive Gallery */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-6">
            {/* Main Image */}
            <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-square group">
              <Image
                src={property.images[0]?.url || '/images/placeholder.jpg'}
                alt={property.title}
                fill
                className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {property.images.slice(1, 5).map((image, index) => (
                <div key={image.id} className="relative aspect-square group">
                  <Image
                    src={image.url}
                    alt={`${property.title} - ${index + 2}`}
                    fill
                    className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                </div>
              ))}
              {property.images.length > 5 && (
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-white text-lg font-medium">
                      +{property.images.length - 5} more
                    </span>
                  </div>
                  <Image
                    src={property.images[5]?.url || '/images/placeholder.jpg'}
                    alt={`${property.title} - more images`}
                    fill
                    className="object-cover rounded-lg opacity-60"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Property Info Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              {/* Property Title and Type Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-6 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                    {property.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 mt-2 break-words">
                    {property.location}
                  </p>
                  {property.googleAddress && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">
                      {property.googleAddress}
                    </p>
                  )}
                </div>

                {/* Property Type and Status Badges */}
                <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${property.type === 'PG' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'}
                    whitespace-nowrap`}
                  >
                    {property.type}
                  </span>
                  {property.furnished && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 
                      rounded-full text-sm font-medium whitespace-nowrap">
                      Furnished
                    </span>
                  )}
                </div>
              </div>
                            {/* Description */}
                            <div className="prose max-w-none text-sm sm:text-base">
                <p className="text-gray-700 whitespace-pre-line break-words">
                  {property.description}
                </p>
              </div>

              {/* Property Quick Stats */}
              <div className="mt-6 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { 
                    label: 'Rooms', 
                    value: property.rooms,
                    icon: (
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                        />
                      </svg>
                    )
                  },
                  { 
                    label: 'Bathrooms', 
                    value: property.bathrooms,
                    icon: (
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M21 12h-4M3 12h4m8-9v4M12 21v-4" 
                        />
                      </svg>
                    )
                  },
                  { 
                    label: 'Available From', 
                    value: new Date(property.available).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    }),
                    icon: (
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    )
                  },
                  { 
                    label: 'Status', 
                    value: property.status,
                    icon: (
                      <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                      </svg>
                    )
                  }
                ].map(({ label, value, icon }) => (
                  <div key={label} 
                    className="bg-gray-50 rounded-lg p-3 sm:p-4 
                      hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {icon}
                      <span className="text-xs sm:text-sm text-gray-500">{label}</span>
                    </div>
                    <p className="mt-1 font-semibold text-sm sm:text-base text-gray-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* PG Sharing Options */}
              {property.type === 'PG' && property.sharingOptions.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">Sharing Options</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {property.sharingOptions.map((option) => (
                      <div key={option.id} 
                        className="bg-gray-50 p-3 sm:p-4 rounded-lg
                          hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                          <div>
                            <h4 className="font-medium text-sm sm:text-base text-gray-900">
                              {option.persons} Person Sharing
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {option.available} out of {option.total} beds available
                            </p>
                          </div>
                          <div className="text-lg sm:text-xl font-bold text-primary-600">
                            {formatPrice(option.price)}
                            <span className="text-xs sm:text-sm text-gray-500">/person</span>
                          </div>
                        </div>
                        {/* Progress bar for occupancy */}
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-500 h-2 rounded-full"
                            style={{ 
                              width: `${((option.total - option.available) / option.total) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                            {/* Amenities Section */}
                            {property.amenities?.length > 0 && (
  <div className="mt-6 sm:mt-8">
    <h3 className="text-lg sm:text-xl font-semibold mb-4">Amenities</h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {property.amenities.map((amenityKey) => {
        const amenity = amenitiesData[amenityKey];
        return (
          <div 
            key={amenityKey} 
            className="flex items-center p-3 space-x-3 bg-gray-50 
              rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-xl sm:text-2xl text-primary-500">
              {amenity.icon}
            </span>
            <span className="text-sm sm:text-base text-gray-700">
              {amenity.label}
            </span>
          </div>
        );
      })}
    </div>
  </div>
)}

              {/* Rules Section */}
              {property.rules?.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4">House Rules</h3>
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                    <ul className="space-y-3">
                      {property.rules.map((rule, index) => (
                        <li 
                          key={index} 
                          className="flex items-start space-x-3 text-sm sm:text-base text-gray-700"
                        >
                          <svg 
                            className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 5l7 7-7 7" 
                            />
                          </svg>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Address Details Section */}
{property.address && (
  <div className="mt-6 sm:mt-8">
    <h3 className="text-lg sm:text-xl font-semibold mb-4">Address Details</h3>
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street Address */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Street Address</label>
          <p className="text-gray-900">{property.address.street}</p>
        </div>

        {/* Landmark */}
        {property.address.landmark && (
          <div className="space-y-1">
            <label className="text-sm text-gray-500">Landmark</label>
            <p className="text-gray-900">{property.address.landmark}</p>
          </div>
        )}

        {/* Area */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Area</label>
          <p className="text-gray-900">{property.address.area}</p>
        </div>

        {/* City */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">City</label>
          <p className="text-gray-900">{property.address.city}</p>
        </div>

        {/* State */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">State</label>
          <p className="text-gray-900">{property.address.state}</p>
        </div>

        {/* Pincode */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">Pincode</label>
          <p className="text-gray-900">{property.address.pincode}</p>
        </div>
      </div>
    </div>
  </div>
)}

              {/* Location Map Section */}
              {property.latitude && property.longitude && (
                <div className="mt-6 sm:mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold">Location</h3>
                    <button
                      onClick={() => {
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        const destination = `${property.latitude},${property.longitude}`;
                        const url = isMobile
                          ? `https://www.google.com/maps/dir/?api=1&destination=${destination}`
                          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location)}`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700
                        text-sm sm:text-base font-medium px-3 py-1.5 rounded-md
                        hover:bg-primary-50 transition-colors duration-200"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                        />
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      </svg>
                      <span>Get Directions</span>
                    </button>
                  </div>
                  <div className="h-[300px] sm:h-[400px] rounded-lg overflow-hidden">
                    <PropertyMap
                      latitude={property.latitude}
                      longitude={property.longitude}
                      address={property.location}
                      height="100%"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
                    {/* Sidebar */}
                    <div className="space-y-4 sm:space-y-6">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <div className="text-center">
                {property.type === 'PG' ? (
                  <>
                    <p className="text-sm sm:text-base text-gray-600">Starting from</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary-600 mt-1">
                      {formatPrice(Math.min(...property.sharingOptions.map(opt => opt.price)))}
                      <span className="text-sm sm:text-base text-gray-600">/person</span>
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {property.sharingOptions.reduce((total, opt) => total + opt.available, 0)} beds available
                    </p>
                  </>
                ) : (
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">
                    {formatPrice(property.price)}
                    <span className="text-sm sm:text-base text-gray-600">/month</span>
                  </p>
                )}
              </div>

              {/* Quick Contact Buttons */}
              {!isOwner && session && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  {/* Get Directions Button */}
                  {property.latitude && property.longitude && (
                    <button
                      onClick={() => {
                        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                        const destination = `${property.latitude},${property.longitude}`;
                        const url = isMobile
                          ? `https://www.google.com/maps/dir/?api=1&destination=${destination}`
                          : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(property.location)}`;
                        window.open(url, '_blank');
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 
                        bg-primary-600 text-white rounded-md hover:bg-primary-700 
                        transition-all duration-300 text-sm sm:text-base"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Get Directions
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Owner Info Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Property Owner</h3>
              <div className="space-y-3">
                <p className="flex items-center text-sm sm:text-base">
                  <span className="w-5 h-5 mr-3 text-gray-400">👤</span>
                  {property.owner.name}
                </p>
                {session && (
                  <>
                    <p className="flex items-center text-sm sm:text-base">
                      <span className="w-5 h-5 mr-3 text-gray-400">📧</span>
                      {property.owner.email}
                    </p>
                    <p className="flex items-center text-sm sm:text-base">
                      <span className="w-5 h-5 mr-3 text-gray-400">📞</span>
                      {property.owner.phone}
                    </p>
                    {property.owner.alternatePhone && (
                      <p className="flex items-center text-sm sm:text-base">
                        <span className="w-5 h-5 mr-3 text-gray-400">📱</span>
                        {property.owner.alternatePhone} (Alternate)
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Property Actions */}
            <PropertyActions
              property={property}
              isOwner={isOwner}
              isAuthenticated={!!session}
              initialSaved={isSaved}
              userId={session?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}