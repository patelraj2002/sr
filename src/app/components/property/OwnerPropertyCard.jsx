// src/app/components/property/OwnerPropertyCard.jsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function OwnerPropertyCard({ property, onDelete, onEdit, onView }) {
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }
    setDeleteLoading(true);
    try {
      await onDelete(property.id);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Property Image */}
      <div className="relative h-48">
        <Image
          src={property.images[0]?.url || '/images/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            property.status === 'ACTIVE' 
              ? 'bg-green-100 text-green-800'
              : property.status === 'RENTED'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {property.status}
          </span>
        </div>
        {property.type && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              property.type === 'PG' 
                ? 'bg-purple-100 text-purple-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {property.type}
            </span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
        <p className="text-gray-600">{property.location}</p>

        {/* Price Section */}
        {property.type === 'PG' ? (
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Sharing Options:</h4>
            <div className="space-y-1 mt-1">
              {property.sharingOptions?.map((option, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{option.persons} Sharing</span>
                  <span className="font-medium">₹{option.price.toLocaleString()}/month</span>
                  <span className="text-gray-500">
                    ({option.available}/{option.total} beds)
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              ₹{property.price?.toLocaleString()}
            </span>
            <span className="text-gray-500 ml-1">/month</span>
          </div>
        )}

        {/* Property Features */}
        <div className="mt-4 flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {property.rooms} Rooms
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {property.bathrooms} Baths
          </div>
          {property.furnished && (
            <div className="flex items-center text-green-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              Furnished
            </div>
          )}
        </div>

        {/* Available Date */}
        <div className="mt-2 text-sm text-gray-500">
          Available from: {new Date(property.available).toLocaleDateString()}
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={() => onView(property.id)}
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View Details
          </button>
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(property.id)}
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </div>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className={`text-red-600 hover:text-red-700 text-sm ${
                deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex items-center">
                {deleteLoading ? (
                  <svg className="animate-spin h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}