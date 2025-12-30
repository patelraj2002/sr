// src/app/admin/properties/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function PropertyManagement() {
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    type: 'ALL',
    status: 'ALL',
    search: '',
    priceRange: {
      min: '',
      max: ''
    }
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/properties');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch properties');
      }
  
      const data = await response.json();
      setProperties(data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update property status');
      }

      setProperties(prev =>
        prev.map(property =>
          property.id === propertyId
            ? { ...property, status: newStatus }
            : property
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      setProperties(prev => prev.filter(property => property.id !== propertyId));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter.type !== 'ALL' && property.type !== filter.type) return false;
    if (filter.status !== 'ALL' && property.status !== filter.status) return false;
    if (filter.priceRange.min && property.price < filter.priceRange.min) return false;
    if (filter.priceRange.max && property.price > filter.priceRange.max) return false;
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      return (
        property.title.toLowerCase().includes(searchTerm) ||
        property.location.toLowerCase().includes(searchTerm) ||
        property.owner.name.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />

          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">All Types</option>
            <option value="PG">PG</option>
            <option value="FLAT">Flat</option>
          </select>

          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="RENTED">Rented</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">Loading...</div>
        ) : filteredProperties.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No properties found
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
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
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.title}
                </h3>
                <p className="text-sm text-gray-600">{property.location}</p>
                <p className="text-lg font-bold text-primary-600 mt-2">
                  ₹{property.price}/month
                </p>

                <div className="mt-4 border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Owner: {property.owner.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Listed: {new Date(property.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleStatusChange(
                      property.id,
                      property.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
                    )}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      property.status === 'ACTIVE'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {property.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    onClick={() => router.push(`/admin/properties/${property.id}`)}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-primary-100 text-primary-700 hover:bg-primary-200"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}