'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { amenitiesData } from '@/app/utils/amenities';

export default function OwnerPropertyDetails({ params }) {
  const router = useRouter();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.propertyId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch property details');
        }
        const data = await response.json();
        setProperty(data.property);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params.propertyId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!property) {
    return <div className="p-6">Property not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{property.title}</h1>
        <button
          onClick={() => router.push(`/dashboard/owner/${params.id}/properties/${params.propertyId}/edit`)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Edit Property
        </button>
      </div>

      {/* Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {property.images.map((image, index) => (
          <div key={image.id} className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={image.url}
              alt={`${property.title} - Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Property Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-600">Type</dt>
              <dd className="font-medium">{property.type}</dd>
            </div>
            {property.type === 'PG' && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Gender</dt>
                <dd className="font-medium">{property.gender || 'Any'}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-600">Rooms</dt>
              <dd className="font-medium">{property.rooms}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Bathrooms</dt>
              <dd className="font-medium">{property.bathrooms}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Furnished</dt>
              <dd className="font-medium">{property.furnished ? 'Yes' : 'No'}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <p className="text-gray-600">{property.location}</p>
          {property.address && (
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-gray-600">Street</dt>
                <dd className="font-medium">{property.address.street}</dd>
              </div>
              {property.address.landmark && (
                <div>
                  <dt className="text-gray-600">Landmark</dt>
                  <dd className="font-medium">{property.address.landmark}</dd>
                </div>
              )}
              <div>
                <dt className="text-gray-600">Area</dt>
                <dd className="font-medium">{property.address.area}</dd>
              </div>
              <div>
                <dt className="text-gray-600">City</dt>
                <dd className="font-medium">{property.address.city}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Pricing Details</h2>
        {property.type === 'PG' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.sharingOptions.map((option) => (
              <div key={option.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">{option.persons}-Sharing</h3>
                <p className="text-lg font-semibold">₹{option.price}/person</p>
                <p className="text-sm text-gray-600">
                  {option.available} of {option.total} beds available
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg font-semibold">₹{property.price}/month</p>
        )}
      </div>

      {/* Amenities */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {property.amenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <span>{amenitiesData[amenity]?.icon}</span>
              <span>{amenitiesData[amenity]?.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      {property.rules.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Property Rules</h2>
          <ul className="list-disc list-inside space-y-2">
            {property.rules.map((rule, index) => (
              <li key={index} className="text-gray-600">{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
