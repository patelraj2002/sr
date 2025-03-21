// src/app/components/property/PropertyCard.jsx
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyCard({ 
  property, 
  isOwner = false, 
  isAuthenticated = false,
  onInquiryClick,
  onSaveClick,
  isSaved = false,
  loading = false
}) {
  const [imageError, setImageError] = useState(false);
  const mainImage = property.images.find(img => img.isMain) || property.images[0];
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/9] sm:aspect-[3/2] lg:aspect-[16/9] overflow-hidden group">
        <Image
          src={imageError ? '/images/placeholder.jpg' : (mainImage?.url || '/images/placeholder.jpg')}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImageError(true)}
          priority={false}
        />
        
        {/* Save Button */}
        {!isOwner && (
          <button
            onClick={() => onSaveClick?.(property.id)}
            disabled={loading}
            className={`absolute top-3 right-3 p-2.5 rounded-full 
              ${isAuthenticated 
                ? isSaved
                  ? 'bg-primary-50 text-primary-600'
                  : 'bg-white/80 hover:bg-white text-gray-600'
                : 'bg-white/80 text-gray-400'
              } backdrop-blur-sm hover:shadow-md transition-all duration-300 z-10
              transform hover:scale-105 active:scale-95
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title={isAuthenticated ? (isSaved ? 'Remove from saved' : 'Save property') : 'Sign in to save'}
          >
            <svg 
              className="w-5 h-5 sm:w-6 sm:h-6" 
              fill={isSaved ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </button>
        )}

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
          <span className="text-xs font-medium text-gray-700">
            {property.type}
          </span>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        
        {/* Location */}
        <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-1 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
        
        {/* Price Information */}
        <div className="flex-grow">
          {property.type === 'FLAT' ? (
            <p className="text-primary-600 font-bold text-base sm:text-lg">
              {formatPrice(property.price)}/month
            </p>
          ) : (
            <div>
              <p className="text-primary-600 font-bold text-base sm:text-lg">
                Starting from {formatPrice(Math.min(...property.sharingOptions.map(opt => opt.price)))}
              </p>
              <div className="mt-2 space-y-1">
                {property.sharingOptions.map(option => (
                  <p key={option.persons} className="text-xs sm:text-sm text-gray-600 flex justify-between">
                    <span>{option.persons}-sharing: {formatPrice(option.price)}/person</span>
                    <span className="text-gray-500">({option.available} beds)</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {property.rooms} {property.rooms === 1 ? 'Room' : 'Rooms'}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              {property.furnished ? 'Furnished' : 'Unfurnished'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          {isOwner ? (
            <>
              <Link
                href={`/properties/${property.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm sm:text-base font-medium transition-colors"
              >
                View Details
              </Link>
              <span className="text-xs sm:text-sm text-gray-500">
                {property.inquiries?.length || 0} inquiries
              </span>
            </>
          ) : (
            <>
              <Link
                href={`/properties/${property.id}`}
                className="text-primary-600 hover:text-primary-700 text-sm sm:text-base font-medium transition-colors"
              >
                View Details
              </Link>
              <button
                onClick={() => onInquiryClick?.(property)}
                disabled={loading}
                className={`w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-md
                  hover:bg-primary-700 active:scale-95 transition-all duration-200
                  text-sm sm:text-base font-medium
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                {loading ? 'Processing...' : 'Inquire Now'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}