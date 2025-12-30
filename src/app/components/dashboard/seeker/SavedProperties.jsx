// src/app/components/dashboard/seeker/SavedProperties.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SavedProperties({ properties }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!properties?.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Properties</h2>
        <div className="text-center py-6">
          <p className="text-gray-500">No saved properties yet</p>
          <Link
            href="/properties"
            className="text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Browse Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Properties</h2>
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start space-x-4">
                <div className="relative h-24 w-24 flex-shrink-0">
                  <Image
                    src={property.images[0]?.url || '/images/placeholder.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary-600"
                  >
                    {property.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{property.location}</p>
                  {property.type === 'PG' ? (
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      Starting from {formatPrice(Math.min(...property.sharingOptions.map(opt => opt.price)))}/month
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-primary-600 mt-1">
                      {formatPrice(property.price)}/month
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}